import { create } from "zustand"
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios";
import { useAuthStore } from "./useAuthStore";


export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null, 
    isUserLoading: false,
    isMessagesLoading: false,

    // getUsers: async () => {
    //     set({ isUserLoading: true });
    //     try {
    //         const res = await axiosInstance.get("/messages/users");
    //         set({ users: res.data });
    //     } catch (error) {
    //         toast.error(error.response.data.message);
    //     } finally {
    //         set({ isUserLoading: false });
    //     }
    // },

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
          const res = await axiosInstance.get("/messages/users");
          set({ users: res.data });
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isUsersLoading: false });
        }
      },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async(messageData) => {
      const {selectedUser, messages} = get()
      try{
        const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
        set({messages: [...messages, res.data]})
      } catch(error){
        toast.error(error.response.data.message);
      }
    },

    subscribeToMessages : () =>{
      const { selectedUser } = get()
      if(!selectedUser) return;

      const socket = useAuthStore.getState().socket

      if (!socket) {
        console.error("Socket is not connected");
        return;
    }

      // todo: optmize this one later
    //   socket.on("newMessage", (newMessage) => {
    //     set({
    //       messages: [...get().messages, newMessage],  //all the message is in history because of ... and newMessage se new message add kar rahe hai
    //     });
    //   });
    // },

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if(!isMessageSentFromSelectedUser) return
      set({
        messages: [...get().messages, newMessage],  //all the message is in history because of ... and newMessage se new message add kar rahe hai
      });
    });
  },

    unsubscribeFromMessages: ()=>{
      const socket = useAuthStore.getState().socket;

      if (!socket) {
        console.error("Socket is not connected, cannot unsubscribe");
        return;
    }

      socket.off("newMessage");
    },

    //todo : uptimize this one later
    setSelectedUser: (selectedUser) => set({selectedUser}),

}))