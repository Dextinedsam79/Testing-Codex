import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Video } from "lucide-react";
import type { InterviewView } from "@/lib/applications";

export function UpcomingInterviews({
  interviews,
}: {
  interviews: InterviewView[];
}) {
  return (
    <div className="flex flex-col gap-2">
      {interviews.map((interview) => (
        <Link
          key={interview.id}
          href={`/applications/${interview.applicationId}`}
          className="flex flex-col gap-2 rounded-xl border border-border p-4 transition-colors hover:border-border-hover hover:bg-surface/50"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-text">
              {interview.companyName}
            </p>
            <Badge variant="cyan">{interview.type}</Badge>
          </div>
          <p className="text-xs text-text-muted">{interview.jobTitle}</p>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(interview.scheduledAt, {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
            <span className="flex items-center gap-1">
              {interview.meetingUrl ? <Video size={12} /> : <MapPin size={12} />}
              {interview.location}
            </span>
          </div>
        </Link>
      ))}
      {interviews.length === 0 && (
        <p className="px-3 py-6 text-center text-sm text-text-muted">
          No upcoming interviews.
        </p>
      )}
    </div>
  );
}
