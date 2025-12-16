import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ConnectionMessageDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (message: string) => void;
    recipientName: string;
}

const DEFAULT_MESSAGE = "Hi, I'd like to connect with you!";

export const ConnectionMessageDialog = ({
    isOpen,
    onClose,
    onConfirm,
    recipientName,
}: ConnectionMessageDialogProps) => {
    const [message, setMessage] = useState(DEFAULT_MESSAGE);

    // Reset message when dialog opens
    useEffect(() => {
        if (isOpen) {
            setMessage(DEFAULT_MESSAGE);
        }
    }, [isOpen]);

    const handleConfirm = () => {
        // If empty, use default (though we start with default, user might clear it)
        const finalMessage = message.trim() || DEFAULT_MESSAGE;
        onConfirm(finalMessage);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-slate-900 border-white/10 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Connect with {recipientName}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Send a message to introduce yourself.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write a message..."
                        className="min-h-[100px] bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                    />
                </div>
                <DialogFooter className="flex gap-2 justify-end">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="text-gray-300 hover:text-white hover:bg-white/10"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Send Request
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
