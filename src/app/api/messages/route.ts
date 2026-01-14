import { NextResponse } from 'next/server';

// In-memory storage for messages (in a real app, this would be a database)
const messages: any[] = [];

// GET /api/messages - Get all messages
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get('patientId');
  
  let filteredMessages = messages;
  
  if (patientId) {
    filteredMessages = messages.filter(msg => 
      msg.patientId === patientId || msg.senderId === patientId
    );
  }
  
  return NextResponse.json({ messages: filteredMessages });
}

// POST /api/messages - Send a new message
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { senderId, senderRole, recipientId, recipientRole, content, patientId } = body;
    
    if (!senderId || !recipientId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const newMessage = {
      id: Date.now().toString(),
      senderId,
      senderRole,
      recipientId,
      recipientRole,
      patientId,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    messages.push(newMessage);
    
    // Store in localStorage for demo purposes
    if (typeof window !== 'undefined') {
      try {
        const existingMessages = JSON.parse(localStorage.getItem('messages') || '[]');
        existingMessages.push(newMessage);
        localStorage.setItem('messages', JSON.stringify(existingMessages));
      } catch (e) {
        console.warn('Could not store message in localStorage:', e);
      }
    }
    
    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/messages/:id - Mark message as read
export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const messageId = url.pathname.split('/').pop();
    
    if (!messageId) {
      return NextResponse.json({ error: 'Message ID required' }, { status: 400 });
    }
    
    const body = await req.json();
    const { read = true } = body;
    
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex === -1) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }
    
    messages[messageIndex].read = read;
    
    // Update localStorage for demo purposes
    if (typeof window !== 'undefined') {
      try {
        const existingMessages = JSON.parse(localStorage.getItem('messages') || '[]');
        const updatedMessages = existingMessages.map((msg: any) => 
          msg.id === messageId ? { ...msg, read } : msg
        );
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
      } catch (e) {
        console.warn('Could not update message in localStorage:', e);
      }
    }
    
    return NextResponse.json({ success: true, message: messages[messageIndex] });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}