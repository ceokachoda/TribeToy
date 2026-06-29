"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

export default function MessagesClient({ initialMessages }: { initialMessages: any[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const { showToast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("contacts")
        .update({ status: newStatus })
        .eq("id", id);
        
      if (error) throw error;
      
      setMessages(messages.map(msg => msg.id === id ? { ...msg, status: newStatus } : msg));
      showToast("Status updated", "success");
      router.refresh();
    } catch (error) {
      console.error(error);
      showToast("Failed to update status", "error");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
          <tr>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Subject</th>
            <th className="px-6 py-4 w-1/3">Message</th>
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {messages.map((msg) => (
            <tr key={msg.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap align-top">
                {new Date(msg.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 align-top font-medium text-slate-900">
                {msg.first_name} {msg.last_name}
              </td>
              <td className="px-6 py-4 align-top">
                <a href={`mailto:${msg.email}`} className="text-blue-600 hover:underline">{msg.email}</a>
              </td>
              <td className="px-6 py-4 align-top font-medium">
                {msg.subject}
              </td>
              <td className="px-6 py-4 align-top">
                <div className="text-sm text-slate-700 whitespace-pre-wrap max-w-md">
                  {msg.message}
                </div>
              </td>
              <td className="px-6 py-4 align-top">
                <select
                  value={msg.status}
                  onChange={(e) => handleStatusChange(msg.id, e.target.value)}
                  className={`text-xs font-semibold rounded-full px-3 py-1 cursor-pointer outline-none border ${
                    msg.status === 'unread' ? 'bg-red-100 text-red-800 border-red-200' : 
                    msg.status === 'replied' ? 'bg-green-100 text-green-800 border-green-200' :
                    'bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
              </td>
            </tr>
          ))}
          {messages.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                No messages found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
