"use client";

import { Upload, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { mockUser } from "@/lib/mock-data";
import { EXPERIENCE_LEVELS, CAREER_PATHS } from "@/lib/constants";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-text">Settings</h1>
        <p className="text-sm text-text-muted">
          Manage your profile and account preferences
        </p>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Profile photo */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Avatar name={mockUser.fullName} size="xl" />
              <div>
                <Button variant="secondary" size="sm">
                  <Upload size={14} />
                  Change Photo
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
                  defaultValue={mockUser.fullName}
                  required
                />
                <Input label="Email" type="email" defaultValue={mockUser.email} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Username"
                  defaultValue={mockUser.username}
                  hint={`Your portfolio URL: talentboard.ai/p/${mockUser.username}`}
                />
                <Input
                  label="Professional Title"
                  defaultValue={mockUser.professionalTitle}
                />
              </div>
              <Input label="Location" defaultValue={mockUser.location} />
              <Textarea
                label="Bio"
                defaultValue={mockUser.bio}
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
                options={CAREER_PATHS.map((p) => ({ value: p, label: p }))}
                defaultValue={mockUser.careerPath}
              />
              <Select
                label="Experience Level"
                options={[...EXPERIENCE_LEVELS]}
                defaultValue={mockUser.experienceLevel}
              />
              <Input
                label="Target Role"
                defaultValue={mockUser.targetRole}
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
                type="url"
                defaultValue={mockUser.linkedinUrl}
              />
              <Input
                label="GitHub URL"
                type="url"
                defaultValue={mockUser.githubUrl}
              />
              <Input
                label="Website URL"
                type="url"
                defaultValue={mockUser.websiteUrl}
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
                  Make your portfolio visible at talentboard.ai/p/{mockUser.username}
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="peer h-6 w-11 rounded-full bg-border after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" />
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="border-danger/30">
          <CardHeader>
            <CardTitle className="text-danger">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text">Delete Account</p>
                <p className="text-xs text-text-muted">
                  Permanently delete your account and all data. This cannot be
                  undone.
                </p>
              </div>
              <Button variant="danger" size="sm">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="secondary">Cancel</Button>
          <Button type="submit">
            <Save size={14} />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
