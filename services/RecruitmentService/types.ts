export enum JobStatus {
  Draft = 1,
  Published = 2,
  Closed = 3,
}

export const getJobStatus = (status) => {
  switch (status) {
    case JobStatus.Draft:
      return "Draft";
    case JobStatus.Published:
      return "Published";
    case JobStatus.Closed:
      return "Closed";
  }
};
