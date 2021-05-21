export const ASSET_INITIAL_STATE = { list: [] };

export const assetReducer = (state = ASSET_INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_ASSETS':
      return { ...action.payload };
    default:
      return state;
  }
};
