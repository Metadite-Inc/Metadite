
import { Search, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FlaggedMessage {
  id: number;
  user: string;
  moderator: string;
  content: string;
  date: string;
  reason: string;
}

interface FlaggedMessagesProps {
  messages: FlaggedMessage[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const FlaggedMessages = ({ messages, searchTerm, onSearchChange }: FlaggedMessagesProps) => {
  const { theme } = useTheme();
  
  const filteredMessages = messages.filter(message =>
    message.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">Flagged Messages</h2>
          <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
            {messages.length} Messages
          </span>
        </div>
        <div className="relative">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary text-sm"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Assigned Moderator</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMessages.map((message) => (
            <TableRow key={message.id}>
              <TableCell className="font-medium">{message.user}</TableCell>
              <TableCell className="max-w-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-1" />
                  <p className="line-clamp-2">{message.content}</p>
                </div>
              </TableCell>
              <TableCell>{message.reason}</TableCell>
              <TableCell>{message.date}</TableCell>
              <TableCell>{message.moderator}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FlaggedMessages;
