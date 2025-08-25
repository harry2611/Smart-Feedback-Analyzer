from fastapi import APIRouter, WebSocket, Depends, WebSocketDisconnect
from typing import List
from app.core.security import get_current_user_ws
from app.schemas.websocket import WSMessage
import json

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.user_connections = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        self.active_connections.append(websocket)
        if user_id not in self.user_connections:
            self.user_connections[user_id] = []
        self.user_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: int):
        self.active_connections.remove(websocket)
        if user_id in self.user_connections:
            self.user_connections[user_id].remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

    async def send_personal_message(self, message: dict, user_id: int):
        if user_id in self.user_connections:
            for connection in self.user_connections[user_id]:
                await connection.send_json(message)

manager = ConnectionManager()

@router.websocket("/ws/{client_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    client_id: int,
    current_user: User = Depends(get_current_user_ws)
):
    await manager.connect(websocket, current_user.id)
    try:
        while True:
            data = await websocket.receive_text()
            message = WSMessage(
                user_id=current_user.id,
                client_id=client_id,
                message=data
            )
            # Broadcast to all connected clients
            await manager.broadcast({
                "user_id": current_user.id,
                "client_id": client_id,
                "message": data
            })
    except WebSocketDisconnect:
        manager.disconnect(websocket, current_user.id)
        await manager.broadcast({
            "user_id": current_user.id,
            "client_id": client_id,
            "message": "left the chat"
        })
