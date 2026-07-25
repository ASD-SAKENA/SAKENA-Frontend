/** Response shapes of the Sakena backend poll endpoints (`/api/v1/polls`). */

export interface PollOptionResultApiResponse {
  optionId: string;
  label: string;
  votes: number;
  percentage: number;
}

export interface PollApiResponse {
  id: string;
  question: string;
  open: boolean;
  createdAt: string;
  closedAt: string | null;
  totalVotes: number;
  /** Whether the signed-in user has already voted. */
  hasVoted: boolean;
  myOptionId: string | null;
  options: PollOptionResultApiResponse[];
}

export interface CreatePollApiPayload {
  question: string;
  options: string[];
}
