
import { Search, CheckCircle, XCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Payment {
  id: string;
  user: string;
  amount: number;
  date: string;
  method: string;
  status: string;
}

interface PaymentsManagementProps {
  payments: Payment[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const PaymentsManagement = ({ payments, searchTerm, onSearchChange }: PaymentsManagementProps) => {
  const { theme } = useTheme();
  
  const filteredPayments = payments.filter(payment =>
    payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="font-semibold">Payment History</h2>
        <div className="relative">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary text-sm"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPayments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">{payment.id}</TableCell>
              <TableCell>{payment.user}</TableCell>
              <TableCell>${payment.amount.toFixed(2)}</TableCell>
              <TableCell>{payment.date}</TableCell>
              <TableCell>{payment.method}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  payment.status === 'Completed' 
                    ? 'bg-green-100 text-green-700' 
                    : payment.status === 'Failed'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {payment.status === 'Completed' && <CheckCircle className="h-3 w-3" />}
                  {payment.status === 'Failed' && <XCircle className="h-3 w-3" />}
                  {payment.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentsManagement;
