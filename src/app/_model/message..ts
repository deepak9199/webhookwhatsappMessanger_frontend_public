// Define a model for the message
export interface Message {
    type: 'incoming' | 'outgoing'; // Type of the message
    text: string; // Text content of the message
    time: string; // Time of the message
    date: string; // Date of the message
    img?: string; // Optional image URL for the avatar
}

// Define a model for the conversation
export interface Conversation {
    cname: string; // Customer name
    phoneno: string; // Customer phone number
    messages: Message[]; // Array of messages exchanged in the conversation
}
