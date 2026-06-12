import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  APPLICATION_SOURCES,
  APPLICATION_STATUSES,
  PRIORITIES,
} from "@/lib/constants";
import type { ApplicationView } from "@/lib/applications";

type ApplicationFormFieldsProps = {
  application?: ApplicationView;
};

export function ApplicationFormFields({ application }: ApplicationFormFieldsProps) {
  return (
    <>
      <input
        type="hidden"
        name="salary_currency"
        value={application?.salaryCurrency ?? "USD"}
      />
      <Input
        label="Company Name"
        name="company_name"
        placeholder="e.g. Stripe"
        defaultValue={application?.companyName ?? ""}
        required
      />
      <Input
        label="Job Title"
        name="job_title"
        placeholder="e.g. Senior Frontend Engineer"
        defaultValue={application?.jobTitle ?? ""}
        required
      />
      <Input
        label="Location"
        name="location"
        placeholder="e.g. San Francisco, CA"
        defaultValue={application?.location ?? ""}
      />
      <Input
        label="Job URL"
        name="job_url"
        type="url"
        placeholder="https://..."
        defaultValue={application?.jobUrl ?? ""}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Min Salary"
          name="salary_min"
          type="number"
          placeholder="180000"
          defaultValue={application?.salaryMin ?? ""}
        />
        <Input
          label="Max Salary"
          name="salary_max"
          type="number"
          placeholder="220000"
          defaultValue={application?.salaryMax ?? ""}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          name="status"
          options={APPLICATION_STATUSES.map((s) => ({
            value: s.value,
            label: s.label,
          }))}
          defaultValue={application?.status ?? "applied"}
        />
        <Select
          label="Priority"
          name="priority"
          options={PRIORITIES.map((priority) => ({
            value: priority.value,
            label: priority.label,
          }))}
          defaultValue={application?.priority ?? "medium"}
        />
      </div>
      <Select
        label="Source"
        name="source"
        options={APPLICATION_SOURCES.map((s) => ({
          value: s.value,
          label: s.label,
        }))}
        defaultValue={application?.source ?? "other"}
        placeholder="How did you find this?"
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date Applied"
          name="date_applied"
          type="date"
          defaultValue={application?.dateApplied ?? ""}
        />
        <Input
          label="Follow-Up Date"
          name="follow_up_date"
          type="date"
          defaultValue={application?.followUpDate ?? ""}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Contact Name"
          name="contact_name"
          placeholder="e.g. Sarah Chen"
          defaultValue={application?.contactName ?? ""}
        />
        <Input
          label="Contact Email"
          name="contact_email"
          type="email"
          placeholder="sarah@example.com"
          defaultValue={application?.contactEmail ?? ""}
        />
      </div>
      <label className="flex items-center gap-2 text-sm font-medium text-text-secondary">
        <input
          name="portfolio_submitted"
          type="checkbox"
          defaultChecked={application?.portfolioSubmitted ?? false}
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
        />
        Portfolio submitted
      </label>
      <Textarea
        label="Notes"
        name="notes"
        placeholder="Any notes about this application..."
        defaultValue={application?.notes ?? ""}
      />
    </>
  );
}
