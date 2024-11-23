let isInContext = false;

type Context = {
  hash: string;
  executedStrategies: string[];
};

let context: Context = {
  hash: '',
  executedStrategies: [],
};

export function runInContext<Return>(cb: (context: Context) => Return): Return {
  const startsContext = !isInContext;
  if (startsContext) {
    startContext();
  }
  const returnVal = cb(getContext());
  if (startsContext) {
    endContext();
  }
  return returnVal;
}

function startContext() {
  isInContext = true;
  context = {
    hash: '',
    executedStrategies: [],
  };
}

function endContext() {
  isInContext = false;
}

export function getContext(): Context {
  if (!isInContext) {
    throw new Error('Not in context');
  }
  return context;
}
