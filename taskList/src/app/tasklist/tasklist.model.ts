export interface Tasklist {
  id: number;
  name: string;
  description: string;
  customer: string;
  time: number;
  timeDetails: [];
  // Add more properties as per your API response
}
