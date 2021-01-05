export const ASSET_SOURCE_INITIAL_STATE = { list: [] };

export const assetSourceReducer = (
  state = ASSET_SOURCE_INITIAL_STATE,
  action
) => {
  switch (action.type) {
    case "UPDATE_ASSET_SOURCES":
      return { ...action.payload };
    default:
      return state;
  }
};
