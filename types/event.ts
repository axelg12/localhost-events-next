export type Event = {
  id: number;
  title: string;
  description: string | null;
  url?: string;
  data: {
    start: string | null;
    end: string | null;
  };
};
