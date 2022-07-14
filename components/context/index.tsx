import { User } from '@prisma/client';
import React, { createContext, useContext, useEffect, useReducer } from 'react';

export const ACTION_CONSTANTS = {
  LOGGED_IN: 'LOGGED_IN',
  LOGGED_OUT: 'LOGGED_OUT',
  LOADED: 'LOADED',
};

interface AuthContextType {
  authenticated: boolean;
  user: Partial<User> | null;
  loading: boolean;
}

interface ActionType {
  type: string;
  payload: any;
}

const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  user: null,
  loading: true,
});

const DispatchContext = createContext<React.Dispatch<ActionType>>(() => {});

const reducer = (initialState: AuthContextType, action: ActionType) => {
  switch (action.type) {
    case ACTION_CONSTANTS.LOGGED_IN:
      return {
        ...initialState,
        authenticated: true,
        user: action.payload,
        loading: false,
      };
    case ACTION_CONSTANTS.LOGGED_OUT:
      return {
        ...initialState,
        authenticated: false,
        user: null,
        loading: false,
      };
    case ACTION_CONSTANTS.LOADED:
      return {
        ...initialState,
        loading: false,
      };
    default:
      return initialState;
  }
};

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [authState, dispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true,
  });

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch('/api/auth/me').then((res) => res.json());
        if (res.username) {
          dispatch({ type: ACTION_CONSTANTS.LOGGED_IN, payload: res });
          return;
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch({ type: ACTION_CONSTANTS.LOADED, payload: null });
      }
    }
    getUser();
  }, []);
  return (
    <AuthContext.Provider value={authState}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </AuthContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthContext);
export const useAuthDispatch = () => useContext(DispatchContext);
