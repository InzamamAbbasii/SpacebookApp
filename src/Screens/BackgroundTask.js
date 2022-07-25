import { AppState } from 'react-native';

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import { postSchedules_Posts } from './API';
const BACKGROUND_FETCH_TASK = 'BACKGROUND_TASK';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const now = Date.now();
    const receivedNewData = ` at ${new Date(now).toLocaleTimeString()}`;

    console.log(
      `My task running in ${AppState.currentState} --> ${receivedNewData}`
    );
    if (AppState.currentState === 'background') {
      await postSchedules_Posts()
        .then((res) => console.log(res))
        .catch((err) => console.log('Error in Schedule posting', err));
    } else {
      console.log(
        `My task running in ${AppState.currentState} -->  ${receivedNewData}`
      );
    }
  } catch (err) {
    console.log('Error In Background Task ', err);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

const registerBackgroundFetchAsync = async () => {
  console.log('register method called...');
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 1, // 1 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
};

const unregisterBackgroundFetchAsync = async () => {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
};

const checkStatusAsync = async () => {
  const status = await BackgroundFetch.getStatusAsync();
  const isRegistered = await TaskManager.isTaskRegisteredAsync(
    BACKGROUND_FETCH_TASK
  );
  return {
    status: status && BackgroundFetch.BackgroundFetchStatus[status],
    isRegistered,
  };
};

export {
  registerBackgroundFetchAsync,
  unregisterBackgroundFetchAsync,
  checkStatusAsync,
};
