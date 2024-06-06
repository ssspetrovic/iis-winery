from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import requests
import numpy as np
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.decorators import permission_classes
from rest_framework import status
from rest_framework.views import APIView
from django.core.mail import send_mail
from django_rest_passwordreset.signals import reset_password_token_created
from django.dispatch import receiver
import io
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_RIGHT
from collections import Counter

from wines.models import Order, OrderItem, Wishlist, WishlistItem

from vehicles.models import Vehicle
from django.db.models import Count
from .models import User, Customer, Manager, Winemaker, Admin, Report, City
from .serializers import UserSerializer, CustomerSerializer, WinemakerSerializer, ManagerSerializer, AdminSerializer, ReportSerializer, CitySerializer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
import matplotlib.pyplot as plt
import matplotlib
from datetime import datetime
matplotlib.use('Agg')


styles = getSampleStyleSheet()
styles['Normal'].fontName = 'Helvetica'
styles['Title'].fontName = 'Helvetica-Bold'
styles['Heading2'].fontName = 'Helvetica-Bold'
styles.add(ParagraphStyle(
    name='Signature',
    fontSize=12,
    leading=14,
    textColor=colors.black,
    alignment=TA_RIGHT,
    spaceAfter=20
))


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([IsAuthenticated])
class AuthenticatedHelloAPIView(APIView):
    def get(self, request, format=None):
        content = {
            'message': 'Hello, authenticated user!'
        }
        return Response(content)


class GetUserRoleAPIView(APIView):
    """
    Retrieve the role of a user.
    """

    def get_object(self, username):
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            raise NotFound("User not found")

    def get(self, request, username, format=None):
        user = self.get_object(username)
        return Response({'role': user.role})


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'
    lookup_url_kwarg = 'username'


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    lookup_field = 'username'
    lookup_url_kwarg = 'username'


class WinemakerViewSet(viewsets.ModelViewSet):
    queryset = Winemaker.objects.all()
    serializer_class = WinemakerSerializer
    lookup_field = 'username'
    lookup_url_kwarg = 'username'


class ManagerViewSet(viewsets.ModelViewSet):
    queryset = Manager.objects.all()
    serializer_class = ManagerSerializer
    lookup_field = 'username'
    lookup_url_kwarg = 'username'


class AdminViewSet(viewsets.ModelViewSet):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    lookup_field = 'username'
    lookup_url_kwarg = 'username'


class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer


class ReportCreateAPIView(generics.CreateAPIView):
    serializer_class = ReportSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReportDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer

    def perform_update(self, serializer):
        user = self.request.user
        if user.role == User.Role.ADMIN:
            if serializer.instance.is_reviewed:
                return Response({"error": "This report has already been reviewed."}, status=status.HTTP_400_BAD_REQUEST)
            serializer.save(is_reviewed=True)
        else:
            return Response({"error": "Only administrators can update reports."}, status=status.HTTP_403_FORBIDDEN)


class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    lookup_field = 'name'
    lookup_url_kwarg = 'name'


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):

    # the below like concatinates your websites reset password url and the reset email token which will be required at a later stage
    email_plaintext_message = "Open the link to reset your password" + " " + \
        "{}{}".format(instance.request.build_absolute_uri(
            "http://localhost:5173/reset-password-confirm/"), reset_password_token.key)

    """
        this below line is the django default sending email function, 
        takes up some parameter (title(email title), message(email body), from(email sender), to(recipient(s))
    """
    send_mail(
        # title:
        "Password Reset for {title}".format(title="Winery portal account"),
        # message:
        email_plaintext_message,
        # from:
        "info@winery.com",
        # to:
        [reset_password_token.user.email],
        fail_silently=False,
    )


class GenerateAdminPDF(APIView):
    def get(self, request, *args, **kwargs):
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        doc.title = "Admin Report"

        elements = []
        username = request.GET.get('username')

        try:
            user = Admin.objects.get(username=username)
        except User.DoesNotExist:
            pass

        def draw_section(title, queryset, fields):
            column_names = [f.replace('_', ' ').replace(
                '.', ' ').title() for f in fields]
            if 'First Name' in column_names:
                column_names[column_names.index('First Name')] = 'Full Name'
            if 'Is Reviewed' in column_names:
                column_names[column_names.index(
                    'Is Reviewed')] = 'Is Reviewed?'
            if 'City Name' in column_names:
                column_names[column_names.index('City Name')] = 'City'

            data = [column_names]
            for obj in queryset:
                row = []
                for i, field in enumerate(fields):
                    if '.' in field:
                        model_field, subfield = field.split('.')
                        if hasattr(getattr(obj, model_field), subfield):
                            row.append(
                                getattr(getattr(obj, model_field), subfield))
                        else:
                            row.append('')
                    elif field == 'first_name':
                        row.append(f"{getattr(obj, 'first_name')} {
                                   getattr(obj, 'last_name')}")
                    elif field == 'last_name':
                        continue
                    elif field == 'address':
                        row.append(f"{getattr(obj, 'address')} {
                                   getattr(obj, 'street_number')}")
                    elif field == 'street_number':
                        continue
                    elif field == 'reply' and not getattr(obj, field):
                        row.append('/')
                    elif field == 'vehicle_type':
                        row.append(getattr(obj, field).capitalize())
                    else:
                        row.append(getattr(obj, field))
                data.append(row)

            formatted_title = title.replace('_', ' ').title()

            table = Table(data)
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ]))
            elements.append(Paragraph(formatted_title, styles['Heading2']))
            elements.append(table)
            elements.append(Spacer(1, 20))

        def add_chart_to_elements(chart_func):
            chart_buffer = chart_func()
            img = Image(chart_buffer)
            img._restrictSize(4 * 72, 3 * 72)
            elements.append(img)

        def add_chart_with_title_to_elements(chart_func, title):
            elements.append(Paragraph(title, styles['Heading2']))
            add_chart_to_elements(chart_func)

        def generate_user_pie_chart():
            labels = ['Customers', 'Winemakers', 'Managers']
            sizes = [Customer.objects.count(), Winemaker.objects.count(),
                     Manager.objects.count()]
            colors = ['gold', 'lightcoral', 'lightskyblue']
            explode = (0.1, 0, 0)

            plt.figure(figsize=(6, 6))
            plt.pie(sizes, explode=explode, labels=labels, colors=colors, autopct='%1.1f%%',
                    shadow=True, startangle=140)
            plt.axis('equal')

            chart_buffer = io.BytesIO()
            plt.tight_layout(pad=1.0)
            plt.savefig(chart_buffer, format='png')
            plt.close()
            chart_buffer.seek(0)
            return chart_buffer

        def generate_city_bar_chart():
            cities = City.objects.all()
            city_names = []
            customer_counts = []
            winemaker_counts = []
            vehicle_counts = []

            for city in cities:
                customer_count = Customer.objects.filter(city=city).count()
                winemaker_count = Winemaker.objects.filter(city=city).count()
                vehicle_count = Vehicle.objects.filter(city=city).count()

                if customer_count > 0 or winemaker_count > 0 or vehicle_count > 0:
                    city_names.append(city.name)
                    customer_counts.append(customer_count)
                    winemaker_counts.append(winemaker_count)
                    vehicle_counts.append(vehicle_count)

            x = np.arange(len(city_names))
            width = 0.2

            fig, ax = plt.subplots(figsize=(10, 6))
            rects1 = ax.bar(x - width, customer_counts,
                            width, label='Customers')
            rects2 = ax.bar(x, winemaker_counts, width, label='Winemakers')
            rects3 = ax.bar(x + width, vehicle_counts, width, label='Vehicles')

            ax.set_xlabel('Cities')
            ax.set_ylabel('Counts')
            ax.set_title('Counts by city and type')
            ax.set_xticks(x)
            ax.set_xticklabels(city_names)
            ax.legend()

            plt.xticks(rotation=45)
            plt.tight_layout()
            chart_buffer = io.BytesIO()
            plt.tight_layout(pad=1.0)
            plt.savefig(chart_buffer, format='png')
            plt.close()
            chart_buffer.seek(0)
            return chart_buffer

        def generate_vehicle_type_pie_chart():
            vehicle_types = Vehicle.objects.values(
                'vehicle_type').annotate(count=Count('vehicle_type'))
            labels = [v['vehicle_type'] for v in vehicle_types]
            sizes = [v['count'] for v in vehicle_types]

            plt.figure(figsize=(6, 6))
            plt.pie(sizes, labels=labels, autopct='%1.1f%%',
                    shadow=True, startangle=140)
            plt.axis('equal')

            chart_buffer = io.BytesIO()
            plt.tight_layout(pad=1.0)
            plt.savefig(chart_buffer, format='png')
            plt.close()
            chart_buffer.seek(0)
            return chart_buffer

        def generate_age_group_bar_chart():
            today = datetime.today()
            age_groups = {
                'Under 18': Customer.objects.filter(date_of_birth__gte=today.replace(year=today.year - 18)).count(),
                '18-25': Customer.objects.filter(date_of_birth__lt=today.replace(year=today.year - 18), date_of_birth__gte=today.replace(year=today.year - 25)).count(),
                '26-45': Customer.objects.filter(date_of_birth__lt=today.replace(year=today.year - 25), date_of_birth__gte=today.replace(year=today.year - 45)).count(),
                '46+': Customer.objects.filter(date_of_birth__lt=today.replace(year=today.year - 45)).count()
            }
            age_group_labels = list(age_groups.keys())
            age_group_counts = list(age_groups.values())

            plt.figure(figsize=(10, 6))
            plt.bar(age_group_labels, age_group_counts, color='skyblue')
            plt.xlabel('Age Groups')
            plt.ylabel('Number of Users')
            plt.title('Distribution of Users by Age Group')

            chart_buffer = io.BytesIO()
            plt.tight_layout(pad=1.0)
            plt.savefig(chart_buffer, format='png')
            plt.close()
            chart_buffer.seek(0)
            return chart_buffer

        def generate_reviewed_report_pie_chart():
            reviewed_reports_count = Report.objects.filter(
                is_reviewed=True).count()
            unreviewed_reports_count = Report.objects.filter(
                is_reviewed=False).count()

            labels = ['Reviewed Reports', 'Unreviewed Reports']
            sizes = [reviewed_reports_count, unreviewed_reports_count]
            colors = ['lightgreen', 'salmon']

            plt.figure(figsize=(6, 6))
            plt.pie(sizes, labels=labels, colors=colors,
                    autopct='%1.1f%%', shadow=True, startangle=140)
            plt.axis('equal')

            chart_buffer = io.BytesIO()
            plt.tight_layout(pad=1.0)
            plt.savefig(chart_buffer, format='png')
            plt.close()
            chart_buffer.seek(0)
            return chart_buffer

        # Prva stranica
        title = "Winery's Admin Report"
        elements.append(Paragraph(title, styles['Title']))

        # Dodavanje korisničkog imena i punog imena korisnika
        if user:
            # Formiranje paragrafa za email i korisničko ime
            email_paragraph = Paragraph(
                f"<b>Email:</b> winery@gmail.com", styles['Normal'])
            username_paragraph = Paragraph(
                f"<b>Username:</b> {user.username}", styles['Normal'])

            # Formiranje paragrafa za phone number i puno ime
            phone_paragraph = Paragraph(
                "<b>Phone:</b> 06312341234", styles['Normal'])
            full_name_paragraph = Paragraph(
                f"<b>Full Name:</b> {user.first_name} {user.last_name}", styles['Normal'])

            # Poravnavanje paragrafa
            data = [
                [email_paragraph, '', '', '', username_paragraph],
                [phone_paragraph, '', '', '', full_name_paragraph]
            ]
            t = Table(data, colWidths=[150, 100, 100, 100, 125])
            t.setStyle(TableStyle([
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('ALIGN', (5, 0), (5, -1), 'RIGHT'),
            ]))
            elements.append(t)
        else:
            elements.append(
                Paragraph("Email: winery@gmail.com", styles['Normal']))
            elements.append(Paragraph("Phone: 06312341234", styles['Normal']))
        elements.append(Spacer(1, 20))

        elements.append(Paragraph('Models:', styles['Heading1']))

        # Detalji modela
        draw_section("Winemakers", Winemaker.objects.all(), [
                     'username', 'first_name', 'email', 'address', 'city.name'])
        draw_section("Managers", Manager.objects.all(), [
                     'username', 'first_name', 'email', 'phone_number'])
        draw_section("Customers", Customer.objects.all(), [
                     'username', 'first_name', 'date_of_birth', 'email', 'address', 'city.name'])
        draw_section("Vehicles", Vehicle.objects.all(), [
                     'driver_name', 'phone_number', 'vehicle_type', 'capacity', 'address', 'city.name'])
        draw_section("Reports", Report.objects.all(), [
                     'description', 'is_reviewed', 'reply'])
        elements.append(Spacer(1, 20))

        # Statistika modela
        elements.append(Paragraph("Statistics:", styles['Heading1']))
        elements.append(Paragraph(f"Number of Winemakers: {
                        Winemaker.objects.count()}", styles['Normal']))
        elements.append(Paragraph(f"Number of Managers: {
                        Manager.objects.count()}", styles['Normal']))
        elements.append(Paragraph(f"Number of Customers: {
                        Customer.objects.count()}", styles['Normal']))
        elements.append(Paragraph(f"Number of Vehicles: {
                        Vehicle.objects.count()}", styles['Normal']))
        elements.append(Paragraph(f"Number of Reports: {
                        Report.objects.count()}", styles['Normal']))
        elements.append(Spacer(1, 20))

        # Grafikon statistike modela - Pie Chart
        add_chart_with_title_to_elements(
            generate_user_pie_chart, "Model Statistics Chart")
        elements.append(Spacer(1, 20))

        # Distribucija korisnika i vozila po gradovima - Bar Chart
        add_chart_with_title_to_elements(
            generate_city_bar_chart, "City Distribution")
        elements.append(Spacer(1, 20))

        # Distribucija tipova vozila - Pie Chart
        add_chart_with_title_to_elements(
            generate_vehicle_type_pie_chart, "Vehicle Type Distribution")
        elements.append(Spacer(1, 20))

        # Distribucija korisnika po starosnim grupama - Bar Chart
        add_chart_with_title_to_elements(
            generate_age_group_bar_chart, "User Age Distribution")
        elements.append(Spacer(1, 20))

        # Dodavanje grafikona procenata pregledanih i nepregledanih izveštaja
        add_chart_with_title_to_elements(
            generate_reviewed_report_pie_chart, "Reviewed Report Percentage")
        elements.append(Spacer(1, 20))

        # Dodavanje potpisa i pečata na dno dokumenta
        signature_text = f"{user.first_name} {user.last_name}, Winery Inc."
        signature = Paragraph(signature_text, styles['Signature'])

        # Funkcija za preuzimanje i čuvanje slike ako već ne postoji
        def get_or_download_image(image_url, image_name):
            if not default_storage.exists(image_name):
                response = requests.get(image_url)
                if response.status_code == 200:
                    # Sačuvajte sliku u lokalnom sistemu
                    image_path = default_storage.save(
                        image_name, ContentFile(response.content))
                else:
                    print("Greška prilikom preuzimanja slike:",
                          response.status_code)
                    return None
            else:
                image_path = default_storage.path(image_name)

            return image_path

        # Preuzimanje slike sa URL-a
        url = "https://cdn.pixabay.com/photo/2014/10/23/19/25/wine-500131_1280.png"
        image_name = "wine_stamp.png"
        image_path = get_or_download_image(url, image_name)

        if image_path:
            # Dodajte sliku u dokument
            stamp = Image(image_path, width=inch * 1.5, height=inch * 1.5)
            stamp.hAlign = 'RIGHT'

            # Dodavanje potpisa i slike u isti blok
            signature_and_stamp = [signature, stamp]
            elements.extend(signature_and_stamp)
        else:
            print("Greška prilikom preuzimanja slike:", HttpResponse.status_code)

        doc.build(elements)
        buffer.seek(0)

        return HttpResponse(buffer, content_type='application/pdf')


# Custom style for centered headings
centered_heading_style = ParagraphStyle(
    name="CenteredHeading", parent=styles['Heading2'], alignment=1)


class GenerateCustomerReport(APIView):
    def get(self, request, *args, **kwargs):
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        doc.title = "Customer Report"

        elements = []
        username = request.GET.get('username')
        print(username)

        try:
            user = Customer.objects.get(username=username)
        except Customer.DoesNotExist:
            return HttpResponse("Customer not found", status=404)

        title = "Customer Report"
        elements.append(Paragraph(title, styles['Title']))
        elements.append(Spacer(1, 20))

        if user:
            # Left column details
            left_column = [
                Paragraph(
                    f"<b>First Name:</b> {user.first_name}", styles['Normal']),
                Paragraph(
                    f"<b>Last Name:</b> {user.last_name}", styles['Normal']),
                Paragraph(
                    f"<b>Username:</b> {user.username}", styles['Normal']),
                Paragraph(f"<b>Email:</b> {user.email}", styles['Normal'])
            ]
            # Right column details
            right_column = [
                Paragraph(
                    f"<b>Date of Birth:</b> {user.date_of_birth}", styles['Normal']),
                Paragraph(f"<b>Address:</b> {user.address}", styles['Normal']),
                Paragraph(f"<b>City:</b> {user.city.name}", styles['Normal']),
                Paragraph(f"<b>Country:</b> Serbia", styles['Normal'])
            ]

            # Creating a table to align the details in columns
            data = [[left_column[0], '', '', right_column[0]],
                    [left_column[1], '', '', right_column[1]],
                    [left_column[2], '', '', right_column[2]],
                    [left_column[3], '', '', right_column[3]]]

            t = Table(data, colWidths=[200, 50, 50, 200])
            t.setStyle(TableStyle([
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('SPAN', (1, 0), (2, 0)),  # Merge empty cells for spacing
                ('SPAN', (1, 1), (2, 1)),
                ('SPAN', (1, 2), (2, 2)),
                ('SPAN', (1, 3), (2, 3)),
            ]))
            elements.append(t)
        else:
            elements.append(Paragraph("Customer not found", styles['Normal']))

        elements.append(Spacer(1, 20))

        # Add Order History section with centered heading
        elements.append(Paragraph("Order History", centered_heading_style))
        elements.append(Spacer(1, 10))

        orders = Order.objects.filter(customer=user)
        if orders.exists():
            order_data = []
            for order in orders:
                order_items = OrderItem.objects.filter(order=order)
                for item in order_items:
                    # Formatting datetime
                    formatted_date = order.datetime.strftime(
                        '%Y-%m-%d %H:%M:%S')
                    order_data.append([
                        formatted_date,
                        item.wine.name,
                        str(item.quantity),
                        "Accepted" if order.is_accepted else "Not Accepted",
                        f"RSD {order.total_price}"
                    ])

            # Table column headers
            order_table_data = [
                [Paragraph("<b>Date</b>", styles['Normal']),
                 Paragraph("<b>Wine</b>", styles['Normal']),
                 Paragraph("<b>Quantity</b>", styles['Normal']),
                 Paragraph("<b>Order Status</b>", styles['Normal']),
                 Paragraph("<b>Total Price</b>", styles['Normal'])]
            ] + order_data

            order_table = Table(order_table_data, colWidths=[
                                100, 150, 70, 100, 100])
            order_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ]))
            elements.append(order_table)
        else:
            elements.append(Paragraph("No orders found", styles['Normal']))

        elements.append(Spacer(1, 20))

        elements.append(Paragraph("Order Statistics", centered_heading_style))
        elements.append(Spacer(1, 10))

        # Generate Pie Charts
        pie_charts = [
            self.add_pie_chart(elements, orders, "Wine Type", "type"),
            self.add_pie_chart(
                elements, orders, "Wine Sweetness", "sweetness"),
            self.add_pie_chart(elements, orders, "Wine Age", "age")
        ]

        # Add the pie charts to a table so they appear in the same row
        pie_chart_table = Table([pie_charts], colWidths=[200, 200, 200])
        elements.append(pie_chart_table)

        elements.append(Spacer(1, 50))
        elements.append(
            Paragraph("Wishlist Statistics", centered_heading_style))
        elements.append(Spacer(1, 10))

        # Fetch wishlist items for the user
        wishlist_items = WishlistItem.objects.filter(wishlist__customer=user)

        if wishlist_items:
            # Generate Pie Charts for wishlist items
            wishlist_pie_charts = [
                self.add_pie_chart(elements, wishlist_items,
                                   "Wine Type", "type"),
                self.add_pie_chart(elements, wishlist_items,
                                   "Wine Sweetness", "sweetness"),
                self.add_pie_chart(elements, wishlist_items, "Wine Age", "age")
            ]
            # Add the pie charts to a table so they appear in the same row
            wishlist_pie_chart_table = Table(
                [wishlist_pie_charts], colWidths=[200, 200, 200])
            elements.append(wishlist_pie_chart_table)
        else:
            elements.append(
                Paragraph("No wishlist items found", styles['Normal']))

        doc.build(elements)
        buffer.seek(0)

        return HttpResponse(buffer, content_type='application/pdf')

    def add_pie_chart(self, elements, orders, title, attribute):
        # Collect data
        attribute_data = []
        for order in orders:
            order_items = OrderItem.objects.filter(order=order)
            for item in order_items:
                attribute_data.append(getattr(item.wine, attribute))

        if attribute_data:
            counter = Counter(attribute_data)
            labels, sizes = zip(*counter.items())

            # Set the figure size to ensure the pie chart is not stretched
            fig, ax = plt.subplots(figsize=(6, 6))
            ax.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90)
            # Equal aspect ratio ensures that pie is drawn as a circle.
            ax.axis('equal')
            plt.title(title, fontsize=20)

            img_buffer = io.BytesIO()
            plt.savefig(img_buffer, format='png')
            img_buffer.seek(0)
            plt.close(fig)

            # Return the Image object
            return Image(img_buffer, width=200, height=200)
