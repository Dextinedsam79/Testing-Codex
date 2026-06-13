"use client";

import { useState, useRef } from "react";
import { Upload, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { EXPERIENCE_LEVELS, CAREER_PATHS } from "@/lib/constants";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export function SettingsForm({ user, profile }: { user: User | null; profile: any }) {
  const supabase = createClient();
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fullName = profile?.full_name || user?.user_metadata?.full_name || "";
  const email = profile?.email || user?.email || "";

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file || !user) return;
      setIsUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      setAvatarUrl(data.publicUrl);

      // Auto-save the avatar_url to the profile
      await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", user.id);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      const msg = error instanceof Error ? error.message : (error as any)?.message || JSON.stringify(error);
      alert("Error uploading avatar: " + msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    const updates = {
      full_name: formData.get("full_name")?.toString() || "",
      username: formData.get("username")?.toString() || null,
      professional_title: formData.get("professional_title")?.toString() || null,
      bio: formData.get("bio")?.toString() || null,
      location: formData.get("location")?.toString() || null,
      career_path: formData.get("career_path")?.toString() || null,
      experience_level: formData.get("experience_level")?.toString() || "entry",
      target_role: formData.get("target_role")?.toString() || null,
      linkedin_url: formData.get("linkedin_url")?.toString() || null,
      github_url: formData.get("github_url")?.toString() || null,
      website_url: formData.get("website_url")?.toString() || null,
      is_public: formData.get("is_public") === "on",
    };

    const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
    
    setIsSaving(false);
    if (error) {
      console.error(error);
      alert("Error saving changes");
    } else {
      alert("Changes saved successfully!");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-text">Settings</h1>
        <p className="text-sm text-text-muted">
          Manage your profile and account preferences
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Profile photo */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Avatar name={fullName || email} src={avatarUrl} size="xl" />
              <div>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Upload size={14} />
                  {isUploading ? "Uploading..." : "Change Photo"}
                </Button>
                <p className="mt-1 text-xs text-text-muted">
                  JPG, PNG, or WebP. Max 2MB.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal info */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  name="full_name"
                  defaultValue={fullName}
                  required
                />
                <Input label="Email" type="email" defaultValue={email} disabled />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Username"
                  name="username"
                  defaultValue={profile?.username || ""}
                  hint={`Your portfolio URL: talentboard.ai/p/${profile?.username || 'username'}`}
                />
                <Input
                  label="Professional Title"
                  name="professional_title"
                  defaultValue={profile?.professional_title || ""}
                />
              </div>
              <Input label="Location" name="location" defaultValue={profile?.location || ""} />
              <Textarea
                label="Bio"
                name="bio"
                defaultValue={profile?.bio || ""}
              />
            </div>
          </CardContent>
        </Card>

        {/* Career info */}
        <Card>
          <CardHeader>
            <CardTitle>Career Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select
                label="Career Path"
                name="career_path"
                options={CAREER_PATHS.map((p) => ({ value: p, label: p }))}
                defaultValue={profile?.career_path || ""}
              />
              <Select
                label="Experience Level"
                name="experience_level"
                options={[...EXPERIENCE_LEVELS]}
                defaultValue={profile?.experience_level || "entry"}
              />
              <Input
                label="Target Role"
                name="target_role"
                defaultValue={profile?.target_role || ""}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="LinkedIn URL"
                name="linkedin_url"
                type="url"
                defaultValue={profile?.linkedin_url || ""}
              />
              <Input
                label="GitHub URL"
                name="github_url"
                type="url"
                defaultValue={profile?.github_url || ""}
              />
              <Input
                label="Website URL"
                name="website_url"
                type="url"
                defaultValue={profile?.website_url || ""}
              />
            </div>
          </CardContent>
        </Card>

        {/* Portfolio visibility */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Visibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text">
                  Public Portfolio
                </p>
                <p className="text-xs text-text-muted">
                  Make your portfolio visible at talentboard.ai/p/{profile?.username || 'username'}
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" name="is_public" className="peer sr-only" defaultChecked={profile?.is_public || false} />
                <div className="peer h-6 w-11 rounded-full bg-border after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" />
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Save */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => window.location.reload()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving || isUploading}>
            <Save size={14} />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
