import { getAuth } from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from '../firebase';

// Function to send a message
export const sendMessage = async (
  currentUserId: string,
  otherUserId: string,
  message: string,
  name: string
): Promise<void> => {
  try {
    const chatRoomId =
      currentUserId > otherUserId
        ? `${currentUserId}-${otherUserId}`
        : `${otherUserId}-${currentUserId}`;

    // Reference to the messages collection in Firestore
    const messagesRef = collection(db, 'chatRooms', chatRoomId, 'messages');

    // Add the new message to the messages collection
    await addDoc(messagesRef, {
      senderId: currentUserId,
      receiverId: otherUserId,
      message: message,
      name: name,
      timestamp: serverTimestamp(),
    });

    // Update the last message in the chatRooms collection
    const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
    await setDoc(
      chatRoomRef,
      {
        lastMessage: message,
        lastMessageTime: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Function to stream messages
export const streamMessages = (
  currentUserId: string,
  otherUserId: string,
  setMessages: any
) => {
  const chatRoomId =
    currentUserId > otherUserId
      ? `${currentUserId}-${otherUserId}`
      : `${otherUserId}-${currentUserId}`;

  const messagesRef = collection(db, 'chatRooms', chatRoomId, 'messages');

  const q = query(messagesRef, orderBy('timestamp'));

  // Subscribe to real-time updates
  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messages);
    },
    (error) => {
      console.error('Error streaming messages:', error);
    }
  );

  return unsubscribe;
};

// Function to create or get chat room
export const createOrGetChatRoom = async (
  currentUserId: string,
  otherUserId: string
): Promise<string> => {
  try {
    const chatRoomId =
      currentUserId > otherUserId
        ? `${currentUserId}-${otherUserId}`
        : `${otherUserId}-${currentUserId}`;

    const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
    await setDoc(chatRoomRef, {
      users: [currentUserId, otherUserId],
    });

    return chatRoomId;
  } catch (error) {
    console.error('Error creating or getting chat room:', error);
    throw error;
  }
};

// Function to upload image
export const uploadImage = async (image: File, setImageURL: any): Promise<void> => {
  try {
    const imageId = uuidv4();
    const storageRef = ref(storage, `images/${imageId}`);

    // Upload the image to Firebase Storage
    const snapshot = await uploadBytes(storageRef, image);

    // Get the download URL of the uploaded image
    const downloadURL = await getDownloadURL(snapshot.ref);

    setImageURL(downloadURL);
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Function to send image message
export const sendImageMessage = async (
  currentUserId: string,
  otherUserId: string,
  imageURL: string,
  name: string
): Promise<void> => {
  try {
    const chatRoomId =
      currentUserId > otherUserId
        ? `${currentUserId}-${otherUserId}`
        : `${otherUserId}-${currentUserId}`;

    // Reference to the messages collection in Firestore
    const messagesRef = collection(db, 'chatRooms', chatRoomId, 'messages');

    // Add the new message to the messages collection
    await addDoc(messagesRef, {
      senderId: currentUserId,
      receiverId: otherUserId,
      imageURL: imageURL,
      name: name,
      timestamp: serverTimestamp(),
    });

    // Update the last message in the chatRooms collection
    const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
    await setDoc(
      chatRoomRef,
      {
        lastMessage: 'Sent an image',
        lastMessageTime: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error sending image message:', error);
    throw error;
  }
};

// Function to delete image
export const deleteImage = async (imageURL: string): Promise<void> => {
  try {
    // Extract the image ID from the URL
    const imageId = imageURL.split('/images%2F')[1].split('?')[0];

    // Create a reference to the image in Firebase Storage
    const storageRef = ref(storage, `images/${imageId}`);

    // Delete the image from Firebase Storage
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};
