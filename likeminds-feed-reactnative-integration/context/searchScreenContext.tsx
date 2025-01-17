import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
  JSX,
  useLayoutEffect,
  useMemo,
} from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { RootStackParamList } from "../models/RootStackParamsList";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface searchScreenContextProviderProps {
  children?: ReactNode;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "LMFeedSearchScreen"
  >;
  route: {
    key: string;
    name: string;
    params: Array<string>;
    path: undefined;
  };
}

export interface searchScreenContextValues {
    searchPostQuery: string;
    setSearchPostQuery: Dispatch<SetStateAction<string>>;
    onBackArrowPress: () => void;
    onCrossPress: () => void;
}

const SearchScreenContext = createContext<
searchScreenContextValues | undefined
>(undefined);

export const useSearchScreenContext = () => {
  const context = useContext(SearchScreenContext);
  if (!context) {
    throw new Error(
      "SearchScreenContext must be used within an searchScreenContextProvider"
    );
  }
  return context;
};

export default function SearchPostContextProvider({
  children,
  navigation,
  route,
}: searchScreenContextProviderProps) {
    const [searchPostQuery, setSearchPostQuery] = useState<string>("");

    console.log("refresh context")

    
    const onBackArrowPress = () => {
        navigation.goBack();
    } 
    
    const onCrossPress = () => {
        setSearchPostQuery("");
    }
    
    const contextValues: searchScreenContextValues = {
        searchPostQuery,
        setSearchPostQuery,
        onBackArrowPress,
        onCrossPress
    }

    return (
        <SearchScreenContext.Provider value={contextValues}>
        {children}
        </SearchScreenContext.Provider>
    );
}