const MULTIPLIER_TO_SECONDS = 1000;

const normalizeData = (data) => data
  .reduce((acc, item) => {
    acc.byId[item.id] = item;
    const date = new Date(item.time * MULTIPLIER_TO_SECONDS);
    acc.byId[item.id].time = date.toLocaleDateString("en-UK");
    acc.allIds.push(item.id);
    return acc;
  }, { byId: {}, allIds:[] });

export default normalizeData;
