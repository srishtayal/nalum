import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Linkedin, Github, Instagram, Facebook, Link } from 'lucide-react';

// The types of social networks we support
type SocialNetwork = 'linkedin' | 'github' | 'instagram' | 'facebook' | 'website';

// The structure for a single social link
export interface SocialLink {
  network: SocialNetwork;
  url: string;
}

interface SocialMediaFormProps {
  socialLinks: SocialLink[];
  setSocialLinks: React.Dispatch<React.SetStateAction<SocialLink[]>>;
}

const ALL_NETWORKS: { name: SocialNetwork; icon: React.ReactNode }[] = [
  { name: 'linkedin', icon: <Linkedin className="h-5 w-5" /> },
  { name: 'github', icon: <Github className="h-5 w-5" /> },
  { name: 'instagram', icon: <Instagram className="h-5 w-5" /> },
  { name: 'facebook', icon: <Facebook className="h-5 w-5" /> },
  { name: 'website', icon: <Link className="h-5 w-5" /> },
];

const SocialMediaForm: React.FC<SocialMediaFormProps> = ({ socialLinks, setSocialLinks }) => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<SocialNetwork | ''>( '');

  const availableNetworks = ALL_NETWORKS.filter(
    (net) => !socialLinks.some((link) => link.network === net.name)
  );

  const handleAddLink = () => {
    if (selectedNetwork && currentUrl) {
      setSocialLinks([...socialLinks, { network: selectedNetwork, url: currentUrl }]);
      setCurrentUrl('');
      setSelectedNetwork('');
    }
  };

  const handleRemoveLink = (networkToRemove: SocialNetwork) => {
    setSocialLinks(socialLinks.filter(link => link.network !== networkToRemove));
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-2 mb-4 p-4 border rounded-lg">
        <Select onValueChange={(val) => setSelectedNetwork(val as SocialNetwork)} value={selectedNetwork}>
          <SelectTrigger className="bg-white/80 text-black">
            <SelectValue placeholder="Select a network" />
          </SelectTrigger>
          <SelectContent>
            {availableNetworks.map(net => (
              <SelectItem key={net.name} value={net.name}>
                <div className="flex items-center gap-2">
                  {net.icon}
                  <span className="capitalize">{net.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={currentUrl}
          onChange={(e) => setCurrentUrl(e.target.value)}
          placeholder="https://..."
          className="bg-white/80 border-gray-300 text-black"
        />
        <Button onClick={handleAddLink} disabled={!selectedNetwork || !currentUrl}>
          Add Link
        </Button>
      </div>

      <div className="space-y-4">
        {socialLinks.map((link) => (
          <Card key={link.network} className="bg-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                {ALL_NETWORKS.find(n => n.name === link.network)?.icon}
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {link.url}
                </a>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleRemoveLink(link.network)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaForm;