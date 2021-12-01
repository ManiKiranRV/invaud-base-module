// eslint-disable-next-line
export const cloneObject = (obj: any): any => {
  return JSON.parse(JSON.stringify({ ...obj }));
};
