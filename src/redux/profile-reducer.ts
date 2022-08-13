import { stopSubmit } from 'redux-form';
import { profileAPI } from '../api/API';
import { updateObjInArr } from '../utils/object-helpers';
import { Photo, ProfileData } from '../types/types';
import { Middleware } from 'redux';

const POST = 'IN_LINK/PROFILE_REDUCER/POST';
const SET_PROFILE = 'IN_LINK/PROFILE_REDUCER/SET_PROFILE';
const SET_MY_PROFILE = 'IN_LINK/PROFILE_REDUCER/SET_MY_PROFILE';
const SET_STATUS = 'IN_LINK/PROFILE_REDUCER/SET_STATUS';
const SET_LOADING = 'IN_LINK/PROFILE_REDUCER/SET_LOADING';
const DELETE_POST = 'IN_LINK/PROFILE_REDUCER/DELETE_POST';
const EDIT_POST = 'IN_LINK/PROFILE_REDUCER/EDIT_POST';
const UPLOAD_PHOTO_SUCCESS = 'IN_LINK/PROFILE_REDUCER/UPLOAD_PHOTO_SUCCESS';
const SET_IS_EDITING = 'IN_LINK/PROFILE_REDUCER/SET_IS_EDITING';

const initialState = {
  posts: [
    {
      id: 1,
      text: 'Hello world',
      likes: 333,
    },
    { id: 2, text: 'I am a coder in react!', likes: 222 },
    {
      id: 3,
      text: 'I code everyday',
      likes: 111,
    },
  ] as Post[],
  profileData: null as ProfileData | null,
  myData: null as ProfileData | null,
  profileStatus: null as string | null,
  storedText: '',
  isLoading: false,
  isEditing: false,
};

export type ProfileReducerState = typeof initialState;

type Action =
  | PostAction
  | DeletePostAction
  | EditPostAction
  | SetEditingAction
  | SetStatusAction
  | SetLoadingAction
  | UploadSuccessAction
  | SetProfileAction
  | SetMyProfileAction;

const profileReducer = (state = initialState, action: Action): ProfileReducerState => {
  switch (action.type) {
    case POST: {
      if (action.payload) {
        return {
          ...state,
          posts: [
            ...state.posts,
            {
              id: state.posts.length + 1,
              text: action.payload,
              likes: 0,
            },
          ],
        };
      }

      return {
        ...state,
        storedText: '',
      };
    }

    case SET_PROFILE:
    case SET_MY_PROFILE:
    case SET_STATUS:
    case SET_LOADING:
    case SET_IS_EDITING:
      return {
        ...state,
        ...action.payload,
      };

    case UPLOAD_PHOTO_SUCCESS:
      return {
        ...state,
        myData: { ...state.myData, photos: { ...action.file } } as ProfileData,
        profileData: { ...state.profileData, photos: { ...action.file } } as ProfileData,
      };

    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((p) => p.id !== action.id),
      };

    case EDIT_POST:
      return {
        ...state,
        posts: updateObjInArr(state.posts, 'id', action.id, {
          text: action.payload,
        }),
      };

    default:
      return state;
  }
};

type Post = {
  id: number;
  text: string;
  likes: number;
};

type PostAction = { type: typeof POST; payload: string };
export const post = (payload: string): PostAction => ({ type: POST, payload });

type DeletePostAction = { type: typeof DELETE_POST; id: number };
export const deletePost = (id: number): DeletePostAction => ({ type: DELETE_POST, id });

type EditPostAction = { type: typeof EDIT_POST; id: number; payload: string };
export const editPost = (id: number, payload: string): EditPostAction => ({
  type: EDIT_POST,
  id,
  payload,
});

type SetEditingAction = { type: typeof SET_IS_EDITING; payload: { isEditing: boolean } };
export const setEditing = (isEditing: boolean): SetEditingAction => ({
  type: SET_IS_EDITING,
  payload: { isEditing },
});

type SetProfileAction = { type: typeof SET_PROFILE; payload: { profileData: ProfileData } };
export const setProfile = (profileData: ProfileData): SetProfileAction => ({
  type: SET_PROFILE,
  payload: { profileData },
});

type SetMyProfileAction = { type: typeof SET_MY_PROFILE; payload: { myData: ProfileData } };
export const setMyProfile = (myData: ProfileData): SetMyProfileAction => ({
  type: SET_MY_PROFILE,
  payload: { myData },
});

type SetStatusAction = { type: typeof SET_STATUS; payload: { profileStatus: string } };
export const setStatus = (profileStatus: string): SetStatusAction => ({
  type: SET_STATUS,
  payload: { profileStatus },
});

type SetLoadingAction = { type: typeof SET_LOADING; payload: { isLoading: boolean } };
export const setLoading = (isLoading: boolean): SetLoadingAction => ({
  type: SET_LOADING,
  payload: { isLoading },
});

type UploadSuccessAction = { type: typeof UPLOAD_PHOTO_SUCCESS; file: Photo };
const uploadSuccess = (file: Photo): UploadSuccessAction => ({
  type: UPLOAD_PHOTO_SUCCESS,
  file,
});

const getData = (uid: number, action: typeof setProfile | typeof setMyProfile) => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    const data = await profileAPI.getProfile(uid);
    dispatch(action(data));
    dispatch(setLoading(false));
  };
};

export const getProfile = (uid: number) => {
  return async (dispatch: any) => {
    dispatch(getData(uid, setProfile));
  };
};

export const getMyProfile = (uid: number) => {
  return async (dispatch: any) => {
    dispatch(getData(uid, setMyProfile));
  };
};

export const getStatus = (uid: number) => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    const data = await profileAPI.getStatus(uid);
    dispatch(setStatus(data));
    dispatch(setLoading(false));
  };
};

export const updateStatus = (payload: string) => {
  return async (dispatch: any) => {
    const result = await profileAPI.updateStatus(payload);
    if (result === 0) dispatch(setStatus(payload));
  };
};

export const uploadPFP = (file: File) => {
  return async (dispatch: any) => {
    const { data, resultCode } = await profileAPI.uploadPFP(file);

    if (resultCode === 0) {
      dispatch(uploadSuccess(data.photos));
    }
  };
};

export const uploadProfileInfo =
  (profileInfo: ProfileData) => async (dispatch: any, getState: any) => {
    const { userId } = getState().profilePage.profileData;

    const data = await profileAPI.uploadProfileInfo({
      ...profileInfo,
    });

    if (data.resultCode === 0) {
      dispatch(getMyProfile(userId));
      dispatch(setEditing(false));
      return Promise.resolve('profile edited');
    } else {
      const message = data.messages.length > 0 ? data.messages[0] : 'An error has occurred';

      const regExp = /\(([^)]+)\)/;
      const errorLocation = regExp?.exec(message)?.[1];

      if (errorLocation) {
        const errorText = message.slice(0, message.indexOf('('));
        const parsedLocation = errorLocation.toLowerCase().split('->');
        dispatch(
          stopSubmit('profileInfo', {
            [parsedLocation[0]]: { [parsedLocation[1]]: errorText },
          }),
        );
      } else dispatch(stopSubmit('profileInfo', { _error: message }));
      return Promise.reject(message);
    }
  };

export default profileReducer;
