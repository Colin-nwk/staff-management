import React, { useState } from 'react';
import { 
  Button, Card, Input, Select, TextArea, Badge, Switch, Checkbox, 
  Alert, Accordion, DropdownMenu, Modal 
} from '../components/ui/Components';
import { DataTable } from '../components/ui/DataTable';
import { useToast } from '../App';
import { 
  Bell, CheckCircle, AlertTriangle, Info, MoreVertical, 
  Trash2, Edit2, Copy, ShoppingCart, CreditCard, Box, User
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

// --- Mock Data for Table ---
type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
  date: string;
}

const payments: Payment[] = [
  { id: "728ed52f", amount: 100, status: "pending", email: "m@example.com", date: "2023-01-01" },
  { id: "489e1d42", amount: 125, status: "processing", email: "example@gmail.com", date: "2023-02-14" },
  { id: "129e1d45", amount: 50, status: "success", email: "success@test.com", date: "2023-03-10" },
  { id: "999e1d99", amount: 75, status: "failed", email: "fail@test.com", date: "2023-04-05" },
  { id: "12345678", amount: 200, status: "success", email: "admin@nexus.com", date: "2023-05-20" },
  { id: "87654321", amount: 300, status: "pending", email: "staff@nexus.com", date: "2023-06-15" },
]

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variant = status === 'success' ? 'success' : status === 'failed' ? 'error' : status === 'processing' ? 'default' : 'warning';
        return <Badge variant={variant as any}>{status}</Badge>
    }
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
      accessorKey: "date",
      header: "Date"
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu 
            trigger={<button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-navy-700"><MoreVertical className="w-4 h-4" /></button>}
            items={[
                { label: 'Copy Payment ID', onClick: () => navigator.clipboard.writeText(row.original.id) },
                { label: 'View Details', onClick: () => alert(`Viewing ${row.original.id}`) },
                { label: 'Refund Payment', onClick: () => alert('Refunded!'), danger: true },
            ]}
        />
      )
    },
  },
]

const Components = () => {
  const { toast } = useToast();
  const [switchState, setSwitchState] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-12 pb-20">
      <div>
        <h1 className="text-3xl font-medium text-navy-900 dark:text-white">UI Components</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">A reusable component library for the NCoS Staff Management System.</p>
      </div>

      {/* --- Buttons --- */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium border-b border-slate-200 dark:border-navy-800 pb-2">Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button disabled>Disabled</Button>
            <Button isLoading>Loading</Button>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
        </div>
      </section>

      {/* --- Alerts --- */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium border-b border-slate-200 dark:border-navy-800 pb-2">Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Alert variant="info" title="Information">This is an informational alert to notify the user of something neutral.</Alert>
            <Alert variant="success" title="Success">Operation completed successfully. Changes have been saved.</Alert>
            <Alert variant="warning" title="Warning">Please verify your data before proceeding to the next step.</Alert>
            <Alert variant="error" title="Critical Error">Failed to connect to the server. Please try again later.</Alert>
        </div>
      </section>

      {/* --- Toasts --- */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium border-b border-slate-200 dark:border-navy-800 pb-2">Toasts</h2>
        <div className="flex flex-wrap gap-4">
            <Button onClick={() => toast('success', 'Your profile has been updated successfully.', 'Changes Saved')}>Success Toast</Button>
            <Button variant="outline" onClick={() => toast('error', 'Could not save file.', 'Upload Failed')}>Error Toast</Button>
            <Button variant="outline" onClick={() => toast('info', 'New version available.', 'System Update')}>Info Toast</Button>
            <Button variant="outline" onClick={() => toast('warning', 'Session expiring soon.', 'Warning')}>Warning Toast</Button>
        </div>
      </section>

      {/* --- Inputs & Forms --- */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium border-b border-slate-200 dark:border-navy-800 pb-2">Inputs & Switches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="space-y-4">
                <Input label="Text Input" placeholder="Type something..." />
                <Select label="Select Option">
                    <option>Option 1</option>
                    <option>Option 2</option>
                </Select>
                <TextArea label="Text Area" placeholder="Enter detailed description..." />
            </Card>
            <Card className="space-y-6">
                <div>
                    <h4 className="text-sm font-medium mb-3">Toggles</h4>
                    <div className="space-y-3">
                        <Switch checked={switchState} onChange={setSwitchState} label="Email Notifications" />
                        <Switch checked={true} onChange={() => {}} label="Auto-Save (Fixed)" />
                        <Switch checked={false} onChange={() => {}} disabled label="Disabled Switch" />
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-medium mb-3">Checkboxes</h4>
                    <div className="space-y-2">
                        <Checkbox label="I agree to the terms and conditions" defaultChecked />
                        <Checkbox label="Subscribe to newsletter" />
                        <Checkbox label="Disabled option" disabled />
                    </div>
                </div>
            </Card>
        </div>
      </section>

      {/* --- Checkout / Summary Card --- */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium border-b border-slate-200 dark:border-navy-800 pb-2">Checkout & Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Simple Checkout Form */}
            <Card className="md:col-span-2">
                <h3 className="font-medium text-lg mb-4">Payment Details</h3>
                <div className="space-y-4">
                    <Input label="Cardholder Name" placeholder="John Doe" />
                    <Input label="Card Number" placeholder="0000 0000 0000 0000" icon={<CreditCard className="w-4 h-4" />} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Expiry Date" placeholder="MM/YY" />
                        <Input label="CVC" placeholder="123" />
                    </div>
                    <div className="pt-4">
                        <Button className="w-full">Pay $1,200.00</Button>
                    </div>
                </div>
            </Card>

            {/* Order Summary */}
            <Card className="bg-slate-50 dark:bg-navy-800 border-none">
                <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-navy-900 dark:text-gold-500" /> Order Summary
                </h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Pro Plan (Yearly)</span>
                        <span className="font-medium">$1,200.00</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Tax (0%)</span>
                        <span className="font-medium">$0.00</span>
                    </div>
                    <div className="h-px bg-slate-200 dark:bg-navy-700 my-2"></div>
                    <div className="flex justify-between text-lg font-bold text-navy-900 dark:text-white">
                        <span>Total</span>
                        <span>$1,200.00</span>
                    </div>
                </div>
            </Card>
        </div>
      </section>

      {/* --- Accordion & Menus --- */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium border-b border-slate-200 dark:border-navy-800 pb-2">Interactive Elements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h4 className="text-sm font-medium mb-3">Accordion</h4>
                <Accordion items={[
                    { title: "What is the NCoS System?", content: "It is a staff management platform for the Nigerian Correctional Service." },
                    { title: "How do I reset my password?", content: "Go to the login page and click 'Forgot Password' to receive a reset link." },
                    { title: "Can I access this on mobile?", content: "Yes, the system is fully responsive and works on mobile devices." }
                ]} />
            </div>
            
            <div className="space-y-6">
                <div>
                    <h4 className="text-sm font-medium mb-3">Dropdown Menu</h4>
                    <DropdownMenu 
                        trigger={<Button variant="outline">Options <MoreVertical className="w-4 h-4 ml-2" /></Button>}
                        items={[
                            { label: 'Edit Profile', onClick: () => {} },
                            { label: 'Settings', onClick: () => {} },
                            { label: 'Delete Account', danger: true, onClick: () => {} }
                        ]}
                        align="left"
                    />
                </div>
                <div>
                    <h4 className="text-sm font-medium mb-3">Modal Dialog</h4>
                    <Button onClick={() => setModalOpen(true)}>Open Confirmation Modal</Button>
                    <Modal 
                        isOpen={modalOpen} 
                        onClose={() => setModalOpen(false)} 
                        title="Confirm Action"
                        footer={
                            <>
                                <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                                <Button onClick={() => setModalOpen(false)}>Confirm</Button>
                            </>
                        }
                    >
                        <p className="text-slate-600 dark:text-slate-300">
                            Are you sure you want to proceed? This action cannot be undone.
                        </p>
                    </Modal>
                </div>
            </div>
        </div>
      </section>

      {/* --- Data Table --- */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium border-b border-slate-200 dark:border-navy-800 pb-2">Data Table</h2>
        <DataTable columns={columns} data={payments} searchKey="email" />
      </section>

    </div>
  );
};

export default Components;
