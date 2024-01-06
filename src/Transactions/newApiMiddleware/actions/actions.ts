// This was taken from a tutorial but I dropped it off. lets try it later.
// see here -> https://medium.com/hackernoon/state-management-with-redux-50f3ec10c10a

const getEntities = (entityName: string) => ({
  type: `ENTITIES_READ_&{entityName.toUpperCase()}`,
  urlParameters: { entityName },
  meta: {
    entityName,
  },
});
