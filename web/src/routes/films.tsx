import {
  Box,
  Center,
  Flex,
  Heading,
  VStack,
  Text,
  Square,
  Circle,
  Spinner,
  InputGroup,
  InputLeftAddon,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useGet } from "restful-react";
import { AppContext, IAppContext } from "..";
import { Input } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { Select } from "antd";
const { Option, OptGroup } = Select;

export default function Films() {
  const {
    title: { setTitle },
    user: { user, setUser },
  }: IAppContext = useContext(AppContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchGenres, setSearchGenres] = useState<number[]>([]);
  const [searchDirectors, setSearchDirectors] = useState<number[]>([]);
  const [searchSortBy, setSearchSortBy] = useState("");

  const queryParams = useMemo(
    () => ({
      searchTerm: searchTerm,
      genres: searchGenres.join(","),
      directors: searchDirectors.join(","),
      orderBy: searchSortBy,
    }),
    [searchTerm, searchGenres, searchDirectors, searchSortBy]
  );
  const { data: films, loading } = useGet({
    path: "search/film",
    queryParams,
    debounce: 300,
  });

  const { data: genres } = useGet({
    path: "genre/list",
  });

  const { data: directors } = useGet({
    path: "director/list",
  });

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(event.target.value);

  const handleGenresChange = (value: number[]) => {
    setSearchGenres(value);
  };

  const handleDirectorsChange = (value: number[]) => {
    setSearchDirectors(value);
  };

  const handleSortByChange = (value: string) => {
    setSearchSortBy(value);
  };

  useEffect(() => {
    setTitle("Films");
  }, []);

  const renderFilm = (film: FilmWithDetails) => {
    return (
      <Box
        bg={"gray.100"}
        w="95%"
        p={4}
        color="black"
        boxShadow={"md"}
        borderRadius={"md"}
        key={film.film_id}
      >
        <Flex>
          <Circle bg="cyan.500" size="150px" flexDir={"column"}>
            <Text fontSize={"xxx-large"} color={"white"}>
              {Math.round(film.rating)}/10
            </Text>
          </Circle>
          <Circle bg="cyan.500" size="150px" flexDir={"column"} marginLeft={1}>
            <Text fontSize={"xxx-large"} color={"white"}>
              {Math.round(film.likes) ?? "Unrated"}
            </Text>
            <Text color={"white"} pos={"relative"} top={"-9%"}>
              Likes
            </Text>
          </Circle>
          <Center flex="1" flexDirection={"column"}>
            <Text
              fontSize={"large"}
              fontFamily={"heading"}
              casing={"uppercase"}
              fontWeight={"bold"}
            >
              {film.film_title} - {film.film_year}
            </Text>
            <Text
              fontSize={"large"}
              fontFamily={"heading"}
              casing={"uppercase"}
              fontWeight={"bold"}
            >
              Runtime: {film.film_runtime ?? "Not Available"}
            </Text>
            <Text
              fontSize={"large"}
              fontFamily={"heading"}
              casing={"uppercase"}
              fontWeight={"bold"}
            >
              Revenue: {!!film.film_revenue ? film.film_revenue : 0}
            </Text>
          </Center>
        </Flex>
      </Box>
    );
  };

  return (
    <Flex marginTop={"1%"} direction={"column"} alignItems={"center"}>
      <Flex
        w={"95%"}
        paddingBottom={"1%"}
        direction={"row"}
        alignItems={"center"}
      >
        <Box w={"30%"}>
          <InputGroup>
            <InputLeftAddon children={loading ? <Spinner /> : <SearchIcon />} />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
          </InputGroup>
        </Box>
        <Box w={"20%"} padding={"1%"}>
          <InputGroup>
            <RangeSlider
              min={1900}
              max={2022}
              aria-label={["min", "max"]}
              defaultValue={[1950, 2022]}
              colorScheme="cyan"
            >
              <RangeSliderTrack bg={"gray.600"}>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
              <RangeSliderThumb index={1} />
            </RangeSlider>
          </InputGroup>
        </Box>
        <Box w={"20%"} padding={"1%"}>
          <Select
            placeholder="Select Genres"
            style={{ width: "100%" }}
            mode="multiple"
            onChange={handleGenresChange}
          >
            {!!genres &&
              genres.map((x: { genre_id: number; genre_name: string }) => (
                <Option key={x.genre_id}>{x.genre_name}</Option>
              ))}
          </Select>
        </Box>
        <Box w={"20%"} padding={"1%"}>
          <Select
            placeholder="Select Directors"
            style={{ width: "100%" }}
            mode="multiple"
            onChange={handleDirectorsChange}
          >
            {!!directors &&
              directors.map(
                (x: { director_id: number; director_name: string }) => (
                  <Option key={x.director_id}>{x.director_name}</Option>
                )
              )}
          </Select>
        </Box>
        <Select
          style={{ width: "10%" }}
          placeholder="Sort By"
          onChange={handleSortByChange}
        >
          {/* DONT LEAVE LIKE THIS --- SQL INJECTION  */}
          <OptGroup label="Rating">
            <Option key={"rating DESC"}>Highest Rated</Option>
            <Option key="rating ASC">Lowest Rated</Option>
          </OptGroup>
          <OptGroup label="Likes">
            <Option key="likes DESC">Most Liked</Option>
            <Option key="likes ASC">Least Liked</Option>
          </OptGroup>
          <OptGroup label="Runtime">
            <Option key="film_runtime DESC">Longest Runtime</Option>
            <Option key="film_runtime ASC">Shortest Runtime</Option>
          </OptGroup>
          <OptGroup label="Revenue">
            <Option key="film_revenue DESC">Highest Revenue</Option>
            <Option key="film_revenue ASC">Lowest Revenue</Option>
          </OptGroup>
        </Select>
      </Flex>
      {JSON.stringify(user)}
      <a
        onClick={() =>
          setUser({
            ...user,
            ...{
              id: 312,
              authenticated: true,
              token: "ijdsaiodjsoaidjsoajdsa",
            },
          })
        }
      >
        Login
      </a>
      <VStack direction="column" spacing={4} w={"100%"}>
        {!!films && films.map((x: FilmWithDetails) => renderFilm(x))}
      </VStack>
    </Flex>
  );
}
