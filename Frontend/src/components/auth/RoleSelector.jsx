
import React from 'react';
import { AtSign, User, UserCog } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RoleSelector = ({ role, setRole }) => {
  return (
    <div className="space-y-1">
      <label htmlFor="role" className="text-sm font-medium text-gray-700">Login as</label>
      <Select value={role} onValueChange={setRole}>
        <SelectTrigger className="w-full">
          <div className="flex items-center">
            <div className="mr-2">
              {role === 'admin' ? (
                <UserCog className="h-4 w-4 text-gray-500" />
              ) : role === 'moderator' ? (
                <AtSign className="h-4 w-4 text-gray-500" />
              ) : (
                <User className="h-4 w-4 text-gray-500" />
              )}
            </div>
            <SelectValue placeholder="Select account type" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-md">
          <SelectItem value="user" className="hover:bg-gray-100">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <span>Regular User</span>
            </div>
          </SelectItem>
          <SelectItem value="moderator" className="hover:bg-gray-100">
            <div className="flex items-center">
              <AtSign className="h-4 w-4 mr-2 text-gray-500" />
              <span>Moderator</span>
            </div>
          </SelectItem>
          <SelectItem value="admin" className="hover:bg-gray-100">
            <div className="flex items-center">
              <UserCog className="h-4 w-4 mr-2 text-gray-500" />
              <span>Administrator</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoleSelector;
