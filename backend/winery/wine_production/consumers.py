import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from datetime import datetime
from .models import FermentationData, FermentationBatch
import random

class FermentationDataConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = 'fermentation_data'
        self.room_group_name = 'fermentation_data_group'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        command = text_data_json.get('command')
        batch = text_data_json.get('batch')

        if command == 'check_fermentation':
            simulated_data = {
                'batch': batch,
                'timestamp': datetime.now().isoformat() + 'Z',
                'temperature': round(random.uniform(20.0, 35.0), 2),
                'sugar_level': round(random.uniform(0.5, 5.0), 2),
                'pH': round(random.uniform(2.8, 4.2), 2),
            }

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_fermentation_data',
                    'data': simulated_data
                }
            )

    @database_sync_to_async
    def save_fermentation_data(self, batch_id, timestamp, temperature, sugar_level, pH):
        FermentationData.objects.create(
            batch_id=batch_id,
            timestamp=timestamp,
            temperature=temperature,
            sugar_level=sugar_level,
            pH=pH
        )

    async def send_fermentation_data(self, event):
        data = event['data']

        batch_id = data['batch']
        timestamp = data['timestamp']
        temperature = data['temperature']
        sugar_level = data['sugar_level']
        pH = data['pH']

        await self.save_fermentation_data(batch_id, timestamp, temperature, sugar_level, pH)

        await self.send(text_data=json.dumps(data))
