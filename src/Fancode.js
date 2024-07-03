import React, { useState, useEffect, useRef } from "react";

const FanCode = () => {

    // State variables - to hold the data for Fancode Moviefix
    const [moviesByYear, setMoviesByYear] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [genresList, setGenresList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [hasScrolled, setHasScrolled] = useState(false);
    const year2012Ref = useRef(null);

    // API key for Fancode - Movie Database 
    const API_KEY = '2dca580c2a14b55200e784d157207b4d';

    // useEffect for auto scrolling to 2012 section once data is loaded
    useEffect(() => {
        if (!loading && !hasScrolled && year2012Ref.current) {
            year2012Ref.current.scrollIntoView({ behavior: 'smooth' });
            setHasScrolled(true);
        }
    }, [loading, hasScrolled]);

    // Generate array of years from 2010 to 2024
    const years = [];
    for (let i = 2010; i <= 2024; i++) {
        years.push(i);
    }

    // Function to fetch list of genres from Fancode API
    const fetchGenres = async () => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`);
            const data = await response.json();
            setGenresList(data.genres);
        } catch (error) {
            console.error('Error fetching genres:', error);
        }
    };

    // Function to fetch movies for a specific year and set of genres
    const fetchMoviesByYearAndGenre = async (year, genres) => {
        try {
            let genreIds = '';
            for (let genre of genres) {
                const foundGenre = genresList.find(g => g.name === genre);
                if (foundGenre) {
                    if (genreIds) genreIds += ',';
                    genreIds += foundGenre.id;
                }
            }

            const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_year=${year}&with_genres=${genreIds}`;

            const response = await fetch(url);
            const data = await response.json();

            return data.results;
        } catch (error) {
            console.error(`Error fetching movies for year ${year}:`, error);
            return [];
        }
    };

    // Function to fetch the Movie details - ie: Genres, Cast, Director etc
    const fetchMovieDetails = async (movieId) => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=credits`
            );
            const data = await response.json();
            return {
                ...data,
                genres: data.genres.map(genre => genre.name),
                cast: data.credits.cast.slice(0, 3).map(actor => actor.name),
                director: data.credits.crew.find(crew => crew.job === 'Director')?.name || 'N/A'
            };
        } catch (error) {
            console.error(`Error fetching details for movie ${movieId}:`, error);
            return null;
        }
    };

    // useEffect to fetch genres after loading
    useEffect(() => {
        fetchGenres();
    }, []);

    // useEffect to fetch all movies when selected genres change
    useEffect(() => {
        const fetchAllMovies = async () => {
            setLoading(true);
            try {
                const movies = {};
                for (const year of years) {
                    const yearMovies = await fetchMoviesByYearAndGenre(year, selectedGenres);
                    const detailedMovies = await Promise.all(
                        yearMovies.map(movie => fetchMovieDetails(movie.id))
                    );
                    movies[year] = detailedMovies.filter(Boolean);
                }
                setMoviesByYear(movies);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllMovies();
    }, [selectedGenres]);

    // Function to toggle genre selection
    const toggleGenre = (genre) => {
        setSelectedGenres(prevGenres => {
            if (prevGenres.includes(genre)) {
                return prevGenres.filter(g => g !== genre);
            } else {
                return [...prevGenres, genre];
            }
        });
    };

    // Function to handle the search movie text
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // to filter movies based on search term
    const filteredMovies = Object.keys(moviesByYear).reduce((acc, year) => {
        acc[year] = moviesByYear[year]?.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return acc;
    }, {});

    // to render loading or error
    if (loading) return <div style={{ color: "white", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading...</div>;
    if (error) return <div style={{ color: "white" }}>Error: {error.message}</div>;

    return (
        <>
            {/* Display the Fancode Movie App Name */}
            <h1 style={{ display: "flex", justifyContent: "center", alignItems: "center", color: "#F0283C" }}>MOVIEFIX</h1>

            {/* Display the buttons for filtering according to Genre - multi select allowed */}
            <div style={{ marginBottom: '20px', width: "75%", marginLeft: "8.5%", marginTop: "20px" }}>
                {genresList.map((genre) => (
                    <button
                        key={genre.id}
                        onClick={() => toggleGenre(genre.name)}
                        style={{
                            marginRight: "10px",
                            marginBottom: "10px",
                            padding: "5px 10px",
                            borderRadius: "4px",
                            backgroundColor: selectedGenres.includes(genre.name) ? "#F0283C" : "#484848",
                            color: "white",
                            border: "0px",
                            cursor: "pointer"
                        }}
                    >
                        {genre.name}
                    </button>
                ))}
            </div>

            {/* Display the search bar for movie search */}
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <input
                    type="text"
                    placeholder="Search movies..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{
                        padding: "12px",
                        width: "300px",
                        fontSize: "16px",
                        borderRadius: "5px",
                        border: "1px solid #ccc"
                    }}
                />
            </div>

            {/* Display the movie cards - that includes - Movie Title, Cast, Genres, Director, Movie Overview */}
            <div style={{ marginLeft: "112px", marginBottom: "20px" }}>
                {years.map(year => (
                    <div key={year} ref={year === 2012 ? year2012Ref : null}>
                        <h2 style={{ color: "white" }}>{year}</h2>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                            {filteredMovies[year]?.map(movie => (
                                <div key={movie.id} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px", width: "300px" }}>
                                    <h3 style={{ color: "white" }}>{movie.title}</h3>
                                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} style={{ width: "100%" }} />
                                    <p style={{ color: "white" }}><strong>Genres:</strong> {movie.genres.join(', ')}</p>
                                    <p style={{ color: "white" }}><strong>Cast:</strong> {movie.cast.join(', ')}</p>
                                    <p style={{ color: "white" }}><strong>Director:</strong> {movie.director}</p>
                                    <p style={{ color: "white" }}><strong>Movie Overview: </strong>{movie.overview.length > 100 ? movie.overview.slice(0, 97) + '...' : movie.overview}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default FanCode;