import json
from channels.generic.websocket import AsyncWebsocketConsumer
from datetime import datetime
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

        if command == 'check_fermentation':
            simulated_data = {
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

    async def send_fermentation_data(self, event):
        data = event['data']
        await self.send(text_data=json.dumps(data))
