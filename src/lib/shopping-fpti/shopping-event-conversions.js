/* @flow */
import type {
  PageView,
  EventType
} from '../../types/shopping-events';
import type { FptiInput, Config } from '../../types';
import { getDeviceInfo } from '../get-device-info';
import { getIdentity, getUserId } from '../local-storage';

import { eventToFptiMapperInit } from './event-handlers';

export type EventToFptiInputMapping = (event : Object) => FptiInput;

function getStoredUserIds() : Object {
  const storedUserIds = getUserId();
  if (storedUserIds) {
    return {
      shopperId: storedUserIds.userId,
      merchantProvidedUserId: storedUserIds.merchantProvidedUserId
    };
  } else {
    return {};
  }
}


export const eventToFptiConverters = (config : Config) => {
  const eventToFptiMapper = eventToFptiMapperInit(config);
  
  function constructFptiInput(
    eventType : EventType,
    event : Object
  ) : Object {
    const containerSummary = config.containerSummary || {};
    const deviceInfo : any  = getDeviceInfo() || {};
    const identity : any = getIdentity() || {};

    const storedUserIds = getStoredUserIds();
    const eventFptiAttributes = eventToFptiMapper.eventToFptiAttributes(eventType, event);

    const fptiInput  =   {
      ...eventFptiAttributes,
      e: 'im',
      flag_consume: 'yes',
      mrid: containerSummary.mrid,
      shopperId: storedUserIds.shopperId,
      t: new Date().getTime(),
      g: new Date().getTimezoneOffset(),
      deviceWidth: deviceInfo.deviceWidth,
      deviceHeight: deviceInfo.deviceHeight,
      screenWidth: deviceInfo.screenWidth,
      screenHeight: deviceInfo.screenHeight,
      colorDepth: deviceInfo.colorDepth,
      rosettaLanguage: deviceInfo.rosettaLanguage,
      location: deviceInfo.location,
      deviceType: deviceInfo.deviceType,
      browserHeight: deviceInfo.browserHeight,
      browserWidth: deviceInfo.browserWidth,
      confidenceScore: identity.confidenceScore,
      encryptedAccountNumber: identity.encryptedAccountNumber,
      identificationType: identity.identificationType
    };

    return fptiInput;
  }
  
  return {
    viewPageToFpti: (viewData : PageView) : Object => {
      return constructFptiInput('page_view', viewData);
    },
    eventToFpti: constructFptiInput
  };
};


