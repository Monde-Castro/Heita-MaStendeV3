import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

interface ContactLandlordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingTitle: string;
  landlordName: string;
  landlordPhone: string;
}

export function ContactLandlordDialog({
  open,
  onOpenChange,
  listingTitle,
  landlordName,
  landlordPhone,
}: ContactLandlordDialogProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adCount, setAdCount] = useState(0);
  const [showContact, setShowContact] = useState(false);

  const handleWatchAd = () => {
    // Simulate watching an ad
    setTimeout(() => {
      setAdCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= 3) {
          setShowContact(true);
        }
        return newCount;
      });
    }, 1000); // Simulated 1-second ad
  };

  if (!user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>
              Please sign in to view landlord contact details.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={() => navigate("/login")}>Sign In</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact Landlord</DialogTitle>
          <DialogDescription>
            Watch 3 ads to view contact details for {listingTitle}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {!showContact ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-lg font-medium">{adCount}/3 ads watched</p>
                <p className="text-sm text-muted-foreground">
                  Watch {3 - adCount} more ads to view contact details
                </p>
              </div>
              <Button
                className="w-full"
                onClick={handleWatchAd}
                disabled={adCount >= 3}
              >
                Watch Ad
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium">Landlord Name:</p>
                <p>{landlordName}</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Contact Number:</p>
                <p>{landlordPhone}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
