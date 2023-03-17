import { Action, Blocker, BrowserHistory, Listener, Location, State, To, createMemoryHistory } from "history";

import { makeAutoObservable } from "mobx";

const browserHistory = createMemoryHistory();

export class RouterService implements BrowserHistory {

  previousPath = '/';

  location: Location = browserHistory.location;
  action: Action = browserHistory.action;

  constructor() {
    makeAutoObservable(this)
  };

  updateState = () => {
    const { location, action } = browserHistory;
    this.previousPath = this.location?.pathname || '/';
    this.location = location;
    this.action = action;
  };

  createHref = (to: To) => {
    const result = browserHistory.createHref(to);
    this.updateState();
    return result;
  };

  push = (to: To, state?: State) => {
    const result = browserHistory.push(to, state);
    this.updateState();
    return result;
  };

  replace = (to: To, state?: State) => {
    const result = browserHistory.replace(to, state);
    this.updateState();
    return result;
  };

  go = (delta: number) => {
    const result = browserHistory.go(delta);
    this.updateState();
    return result;
  };

  back = () => {
    const result = browserHistory.back();
    this.updateState();
    return result;
  };

  forward = () => {
    const result = browserHistory.forward();
    this.updateState();
    return result;
  };

  listen = (listener: Listener) => {
    const result = browserHistory.listen(listener);
    this.updateState();
    return result;
  };

  block = (blocker: Blocker) => {
    const result = browserHistory.block(blocker);
    this.updateState();
    return result;
  };

};

export default RouterService;
