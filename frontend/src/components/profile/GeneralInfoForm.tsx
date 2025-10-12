import React from 'react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GeneralInfoFormProps {
  batch: string;
  setBatch: (value: string) => void;
  branch: string;
  setBranch: (value: string) => void;
  campus: string;
  setCampus: (value: string) => void;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1983 + 1 }, (_, i) => String(currentYear - i));

const branches = [
  "Electronics and Communication Engineering (ECE)",
  "Computer Engineering (COE)",
  "Computer Science and Engineering (CSE)",
  "Computer Science and Engineering (Artificial Intelligence) (CSAI)",
  "Information Technology (IT)",
  "Mathematics and Computing (MAC)",
  "Electrical Engineering (EE)",
  "Instrumentation and Control Engineering (ICE)",
  "Mechanical Engineering (ME)",
  "Bio-Technology (BT)",
  "Civil Engineering (CE)",
];

const campuses = ["MAIN", "WEST", "EAST"];

const GeneralInfoForm: React.FC<GeneralInfoFormProps> = ({ batch, setBatch, branch, setBranch, campus, setCampus }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <Label htmlFor="batch">Batch (Year of Entry)</Label>
        <Select onValueChange={setBatch} value={batch}>
          <SelectTrigger id="batch" className="bg-white/80 text-black">
            <SelectValue placeholder="Select your batch" />
          </SelectTrigger>
          <SelectContent>
            {years.map(year => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="branch">Branch</Label>
        <Select onValueChange={setBranch} value={branch}>
          <SelectTrigger id="branch" className="bg-white/80 text-black">
            <SelectValue placeholder="Select your branch" />
          </SelectTrigger>
          <SelectContent>
            {branches.map(b => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="campus">Campus</Label>
        <Select onValueChange={setCampus} value={campus}>
          <SelectTrigger id="campus" className="bg-white/80 text-black">
            <SelectValue placeholder="Select your campus" />
          </SelectTrigger>
          <SelectContent>
            {campuses.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default GeneralInfoForm;
