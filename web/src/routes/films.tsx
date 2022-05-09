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
  Button,
  useToast,
  useRadioGroup,
  IconButton,
  Link,
  Tooltip,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useGet, useMutate } from "restful-react";
import { AppContext, IAppContext } from "..";
import { Input } from "@chakra-ui/react";
import { ArrowLeftIcon, ArrowRightIcon, SearchIcon } from "@chakra-ui/icons";
import { Select } from "antd";
import { userInfo } from "os";
const { Option, OptGroup } = Select;

export default function Films() {
  const {
    title: { setTitle },
    auth: { token, user },
  }: IAppContext = useContext(AppContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchGenres, setSearchGenres] = useState<number[]>([]);
  const [searchDirectors, setSearchDirectors] = useState<number[]>([]);
  const [searchSortBy, setSearchSortBy] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const toast = useToast();

  const queryParams = useMemo(
    () => ({
      searchTerm: searchTerm,
      genres: searchGenres.join(","),
      directors: searchDirectors.join(","),
      orderBy: searchSortBy,
      page_number: pageNumber,
    }),
    [searchTerm, searchGenres, searchDirectors, searchSortBy, pageNumber]
  );
  const {
    data: films,
    loading,
    refetch,
  } = useGet({
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

  const handleLike = () => {
    setTimeout(() => {
      refetch();
    }, 500);
  };

  useEffect(() => {
    setTitle("Films");
  }, []);

  const RenderFilm = ({
    film,
    handleLike,
  }: {
    film: FilmWithDetails;
    handleLike: () => void;
  }) => {
    const {
      auth: { user },
    }: IAppContext = useContext(AppContext);

    const {
      data: likeResponse,
      loading: likeLoading,
      refetch: like,
    } = useGet({
      path: "feedback/like",
      lazy: true,
      queryParams: {
        film_id: film.film_id,
        user_id: user.user_id,
      },
    });

    const handleLikeFilm = () => {
      like();
      handleLike();
    };

    useEffect(() => {
      if (!!likeResponse) {
        toast({
          title: "Film Liked",
          description: "You have liked " + film.film_title,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
      if (likeResponse != null && !likeResponse) {
        toast({
          title: "Film Not Liked",
          description: "You have already liked " + film.film_title,
          status: "warning",
          duration: 4000,
          isClosable: true,
        });
      }
    }, [likeResponse]);

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
          <Circle
            bg={film.rating < 5 ? "lightsalmon" : "whatsapp.200"}
            size="150px"
            flexDir={"column"}
          >
            <Text fontSize={"xxx-large"} color={"white"}>
              {Math.round(film.rating)}/10
            </Text>
          </Circle>
          <Circle
            bg="linkedin.400"
            size="150px"
            flexDir={"column"}
            marginLeft={1}
          >
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
              Runtime:
              {film.film_runtime
                ? film.film_runtime + " minutes"
                : "Not Available"}
            </Text>
            <Text
              fontSize={"large"}
              fontFamily={"heading"}
              casing={"uppercase"}
              fontWeight={"bold"}
            >
              Revenue: ${!!film.film_revenue ? film.film_revenue : 0}
            </Text>
            <Text>{film.actors.split(",").map((a: any) => " " + a + ",")}</Text>
            <Text>
              {film.directors.split(",").map((a: any) => " " + a + " ")}
            </Text>
          </Center>
          <VStack
            w={"10%"}
            spacing={"4"}
            justifyContent={"space-around"}
            alignItems={"stretch"}
          >
            <Tooltip
              hasArrow
              label="You must login to like"
              shouldWrapChildren
              isDisabled={!!user.user_id}
            >
              <Button
                colorScheme="teal"
                size="lg"
                onClick={() => handleLikeFilm()}
                disabled={!user.user_id}
              >
                Like
              </Button>
            </Tooltip>
            <Button colorScheme="linkedin" size="lg">
              Review
            </Button>
          </VStack>
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
      <VStack direction="column" spacing={4} w={"100%"}>
        {!!films ? (
          films.map((x: FilmWithDetails) => (
            <RenderFilm film={x} handleLike={handleLike} />
          ))
        ) : (
          <Heading>No Results</Heading>
        )}
      </VStack>
      <Flex direction={"row"} marginTop={10}>
        <IconButton
          aria-label="Left"
          icon={<ArrowLeftIcon />}
          onClick={() =>
            pageNumber > 0 ? setPageNumber(pageNumber - 1) : setPageNumber(0)
          }
        />
        <IconButton
          aria-label="Right"
          icon={<ArrowRightIcon />}
          onClick={() => setPageNumber(pageNumber + 1)}
        />
      </Flex>
      <Link onClick={() => setPageNumber(0)}>Back to start</Link>
    </Flex>
  );
}
