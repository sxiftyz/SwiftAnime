import Axios from 'axios'

const BASE_URL: String = 'https://graphql.anilist.co/'

// eslint-disable-next-line import/no-anonymous-default-export
export default {

    // HOME PAGE
    getNewReleases: async (type: String, format?: String) => {

        const seasonYear = new Date().getFullYear() - 3
        let season;

        switch (new Date().getMonth()) {
            case 0:
                season = 'WINTER'
                break;
            case 1:
                season = 'WINTER'
                break;
            case 2:
                season = 'SPRING'
                break;
            case 3:
                season = 'SPRING'
                break;
            case 4:
                season = 'SPRING'
                break;
            case 5:
                season = 'SUMMER'
                break;
            case 6:
                season = 'SUMMER'
                break;
            case 7:
                season = 'SUMMER'
                break;
            case 8:
                season = 'AUTUMN'
                break;
            case 9:
                season = 'AUTUMN'
                break;
            case 10:
                season = 'AUTUMN'
                break;
            case 11:
                season = 'WINTER'
                break;
            default: // exception/error
                season = 'SUMMER'
                break;
        }

        try {

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({

                    query: `query($type: MediaType, $format: MediaFormat, $season: MediaSeason, $seasonYear: Int, $page: Int, $perPage: Int) {
                        Page(page: $page, perPage: $perPage){
                            media (season: $season, seasonYear: $seasonYear, type: $type, format: $format, isAdult: false){
                                title{
                                    romaji
                                    native
                                }
                                startDate{
                                    year
                                    month
                                    day
                                }
                                season
                                seasonYear
                                isAdult
                                id
                                coverImage{
                                    extraLarge
                                    large
                                    medium
                                    color
                                }
                                bannerImage
                                type
                                format
                                genres
                                trending
                                popularity
                                averageScore
                            }
                        }
                    }
                `,
                    variables: {
                        'type': `${type}`,
                        'format': `${(format === 'MOVIE' && 'MOVIE') || (type === 'MANGA' && 'MANGA') || (type === 'ANIME' && 'TV')}`,
                        'page': 1,
                        'perPage': 1,
                        // 'perPage': 5,
                        'season': `${season}`,
                        'seasonYear': `${seasonYear}`
                    }

                })

            })

            console.log(data.data.Page.media)

            return data.data.Page.media

        }
        catch (error) {

            return console.log(error)

        }
    },

    getReleasingThisWeek: async (type: String, format?: String) => {

        try {

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    query: `
                        query($type: MediaType, $format: MediaFormat, $perPage: Int, $page: Int){
                            Page(page: $page, perPage: $perPage){
                                media(status: RELEASING, type: $type, format: $format, isAdult: false, sort: UPDATED_AT_DESC){
                                    title{
                                        romaji
                                        native
                                    }
                                    nextAiringEpisode{
                                        airingAt
                                        episode
                                    }
                                    status
                                    episodes
                                    averageScore
                                    startDate{
                                        year
                                        month
                                        day
                                    }
                                    endDate{
                                        year
                                        month
                                        day
                                    }
                                    season
                                    seasonYear
                                    isAdult
                                    id
                                    coverImage{
                                        extraLarge
                                        large
                                        medium
                                        color
                                    }
                                    bannerImage
                                    type
                                    format
                                    genres
                                    trending
                                    popularity
                                    averageScore
                                }
                            }
                        }
                    `,
                    variables: {
                        'type': `${type}`,
                        'format': `${(format === 'MOVIE' && 'MOVIE') || (type === 'MANGA' && 'MANGA') || (type === 'ANIME' && 'TV')}`,
                        'page': 1,
                        'perPage': 4,
                        'year': new Date().getFullYear(),
                    }
                })
            })

            // console.log(data.data.Page.media)

            return data.data.Page.media

        }
        catch (error) {

            return console.log(error)

        }

    },

    getTrending: async (type: String, format?: String) => {

        try {

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    query: `
                        query($type: MediaType, $perPage: Int, $page: Int){
                            Page(page: $page, perPage: $perPage){
                                media(type: $type, isAdult: false, sort: TRENDING_DESC){
                                    title{
                                        romaji
                                        native
                                    }
                                    
                                    status
                                    episodes
                                    averageScore
                                    nextAiringEpisode{
                                        id
                                        episode
                                        airingAt
                                    }
                                    startDate{
                                        year
                                        month
                                        day
                                    }
                                    endDate{
                                        year
                                        month
                                        day
                                    }
                                    season
                                    seasonYear
                                    isAdult
                                    id
                                    coverImage{
                                        extraLarge
                                        large
                                        medium
                                        color
                                    }
                                    bannerImage
                                    type
                                    format
                                    genres
                                    trending
                                    popularity
                                    averageScore
                                }
                            }
                        }
                    `,
                    variables: {
                        'type': `${type}`,
                        'format': `${(format === 'MOVIE' && 'MOVIE') || (type === 'MANGA' && 'MANGA') || (type === 'ANIME' && 'TV')}`,
                        'page': 1,
                        'perPage': 3,
                        'year': new Date().getFullYear(),
                    }
                })
            })

            // console.log(data.data.Page.media)

            return data.data.Page.media

        }
        catch (error) {

            return console.log(error)

        }

    },

    getTopRated: async (type: String, format?: String) => {

        try {

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    query: `
                        query($type: MediaType, $perPage: Int, $page: Int){
                            Page(page: $page, perPage: $perPage){
                                media(type: $type, isAdult: false, sort: SCORE_DESC){
                                    title{
                                        romaji
                                        native
                                    }
                                    status
                                    episodes
                                    averageScore
                                    startDate{
                                        year
                                    }
                                    isAdult
                                    id
                                    trailer{
                                        thumbnail
                                    }
                                    bannerImage
                                    coverImage{
                                        extraLarge
                                        large
                                        medium
                                        color
                                    }
                                    type
                                    format
                                    genres
                                    trending
                                    popularity
                                    averageScore
                                }
                            }
                        }
                    `,
                    variables: {
                        'type': `${type}`,
                        'format': `${(format === 'MOVIE' && 'MOVIE') || (type === 'MANGA' && 'MANGA') || (type === 'ANIME' && 'TV')}`,
                        'page': 1,
                        'perPage': 3,
                    }
                })
            })

            // console.log(data.data.Page.media)

            return data.data.Page.media

        }
        catch (error) {

            return console.log(error)

        }

    },

    //SEARCH
    getSeachResults: async (searchThis: String, type?: String) => {

        try {

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    query: `
                        query($perPage: Int, $page: Int, $type: MediaType, $search: String){
                            Page(page: $page, perPage: $perPage){
                                media(type: $type, isAdult: false, search: $search){
                                    title{
                                        romaji
                                        native
                                    }
                                    episodes
                                    startDate{
                                        year
                                    }
                                    isAdult
                                    id
                                    coverImage{
                                        extraLarge
                                        large
                                        medium
                                        color
                                    }
                                    type
                                    format
                                    genres
                                    averageScore
                                }
                            }
                        }
                    `,
                    variables: {
                        'type': `${type ? `${type}` : 'ANIME'}`,
                        'search': `${searchThis}`,
                        'page': 1,
                        'perPage': 3,
                    }
                })
            })

            // console.log(data.data.Page.media)

            return data.data.Page.media

        }
        catch (error) {

            console.log(error)

        }
    },

    //ANIME, MOVIE, MANGA PAGE 

    //INFO OF CERTAIN anime/movie/manga ID
    getInfoFromThisMedia: async (id: number, type: String) => {

        try {

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    query: `
                        query($type: MediaType, $id: Int){
                                Media(type: $type, id: $id){
                                    title{
                                        romaji
                                        native
                                    }
                                    description
                                    status
                                    episodes
                                    duration
                                    source
                                    countryOfOrigin
                                    trailer{
                                        id
                                        site
                                        thumbnail
                                    }
                                    updatedAt
                                    favourites
                                    tags{
                                        name
                                        description
                                        isAdult
                                        isMediaSpoiler
                                    }
                                    characters(sort: ROLE){
                                        edges{
                                            id
                                            role
                                            node{
                                                name{
                                                    full
                                                    native
                                                    alternative
                                                }
                                                image{
                                                    large
                                                    medium
                                                }
                                                gender
                                                age
                                            }
                                            voiceActors{
                                                id
                                                name{
                                                    first
                                                    middle
                                                    last
                                                    full
                                                    native
                                                    alternative
                                                }
                                                image{
                                                    large
                                                    medium
                                                }
                                                description
                                                age
                                            }
                                            media{
                                                title{
                                                    romaji
                                                    native
                                                }
                                            }
                                        }
                                    }
                                    recommendations{
                                        edges{
                                            node{
                                                id
                                                mediaRecommendation{
                                                    id
                                                    title{
                                                        romaji
                                                    }
                                                    coverImage{
                                                        extraLarge
                                                        large
                                                        medium
                                                        color
                                                    }
                                                }
                                            }
                                        }

                                    }
                                    studios{
                                        edges{
                                            node{
                                                name
                                                id
                                                isAnimationStudio
                                                siteUrl
                                            }
                                        }
                                    }
                                    streamingEpisodes{
                                        title
                                        thumbnail
                                        url
                                        site
                                    }
                                    averageScore
                                    nextAiringEpisode{
                                        id
                                        episode
                                        airingAt
                                    }
                                    startDate{
                                        year
                                        month
                                        day
                                    }
                                    endDate{
                                        year
                                        month
                                        day
                                    }
                                    season
                                    seasonYear
                                    isAdult
                                    id
                                    coverImage{
                                        extraLarge
                                        large
                                        medium
                                        color
                                    }
                                    bannerImage
                                    type
                                    format
                                    genres
                                    popularity
                                    averageScore
                                }
                            }
                    `,
                    variables: {
                        'id': `${id}`,
                        'type': `${type}`,
                    }
                })
            })

            return data.data.Media;
        }
        catch (error) {

            return console.log(error)
        }


    }
}
