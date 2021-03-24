import React, {useEffect, useState, useRef} from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions, ImageBackground, TextInput, TouchableOpacity, Image } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons'
import Carousel, {CarouselProps} from 'react-native-snap-carousel'

const {width: screenWidth, height: screenHeight} = Dimensions.get('window')

interface MovieProps {
  id: string
  name: string
  overview: string
  release_date: string
  poster_path: string
  [key: string]: string
} 

interface RenderItemProps {
  item: MovieProps
  index: number
}

const App: React.FC = () => {

  const carouselRef = useRef(null)

  const [newMovies, setNewMovies] = useState<MovieProps[]>([])

  const [backgroundImage, setBackgroundImage] = useState('')
  const [currentlySelectedMovieTitle, setCurrentlySelectedMovieTitle] = useState('')
  const [currentlySelectedMovieOverview, setCurrentlySelectedMovieOverview] = useState('')
  
  useEffect(()=>{
    (async ()=>{
      const response = await fetch('https://api.themoviedb.org/3/discover/tv?with_network=213&language=pt-BR&page=1&api_key=f07a8ef834fe329c395643f03ebb3ade')
      const {results} = await response.json()
      
      setNewMovies(results)
      setBackgroundImage(`https://image.tmdb.org/t/p/w300/${results[0].poster_path}`)
      setCurrentlySelectedMovieTitle(results[0].name)
      setCurrentlySelectedMovieOverview(results[0].overview)
    })()
  }, [])

  const _renderItem = ({item, index}: RenderItemProps) => {
    return (
      <View>
        <TouchableOpacity>
          <Image 
            source={{uri: `https://image.tmdb.org/t/p/w300/${item.poster_path}`}}
            style={styles.carouselImage}
          />
          <Text style={styles.carouselTitle}>
            {item.title}
          </Text>
          <Icon name='play-circle-outline' size={30} color='#fff' style={styles.carouselIcon} />
        </TouchableOpacity>
      </View>
    )
  }


  return (
    <ScrollView style={styles.container}>
      <View style={{flex: 1, height: screenHeight}}>
        <View style={{ ...StyleSheet.absoluteFillObject ,backgroundColor: '#000'}} >
          <ImageBackground
            source={{uri:backgroundImage}}
            style={styles.backgroundImage}
            blurRadius={8}
          >
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                placeholder='Procurando algo?'
                placeholderTextColor='#555'
              />
              <TouchableOpacity style={styles.icon}>
                <Icon name='search' color='#000' size={25} />
              </TouchableOpacity>
            </View>

            <Text
              style={{color: '#fff', fontSize: 25, marginLeft: 10, marginVertical: 10}}
            >
              Chegarão em Breve
            </Text>

            <View style={styles.carouselContainer} >
              <Carousel 
                style={styles.carousel}
                ref={carouselRef}
                data={newMovies}
                renderItem={_renderItem}
                sliderWidth={screenWidth}
                itemWidth={200}
                inactiveSlideOpacity={0.5}
                onSnapToItem={index => {
                 setBackgroundImage(`https://image.tmdb.org/t/p/w300/${newMovies[index].poster_path}`)
                 setCurrentlySelectedMovieTitle(newMovies[index].name)
                 setCurrentlySelectedMovieOverview(newMovies[index].overview)
                }}
              />
            </View>

            <View style={styles.movieInfo}>
              <View style={{marginTop: 10, width: '95%'}}>
                <Text style={styles.movieInfoTitle} >{currentlySelectedMovieTitle}</Text>
                <Text style={styles.movieInfoText}>{currentlySelectedMovieOverview}</Text>
              </View>

              <TouchableOpacity style={{marginRight: 15, marginTop: 10}}>
                <Icon name="queue" color="#131313" size={30} />
              </TouchableOpacity>
            </View>

          </ImageBackground>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    opacity: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#000'
  },
  inputContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    elevation: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: '95%',
    flexDirection: 'row',
    alignSelf: 'center'
  },
  input: {
    width: '90%',
    padding: 13,
    paddingLeft: 20,
    fontSize: 17,
    color: '#000'
  },
  icon: {
    position: 'absolute',
    right: 20,
    top: 15
  },
  carouselContainer: {
    width: '100%',
    height: 350,
    justifyContent: 'center',
    alignItems: 'center'
  },
  carousel: {
    flex: 1,
    overflow: 'visible'
  },
  carouselImage: {
    alignSelf: 'center',
    width: 200,
    height: 300,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  carouselTitle: {
    padding: 15,
    color: '#fff',
    position: 'absolute',
    bottom: 10,
    left: 2,
    fontWeight: 'bold'
  },
  carouselIcon: {
    position: 'absolute',
    top: 15,
    right: 15
  },
  movieInfo: {
    backgroundColor: '#fff',
    width: screenWidth,
    height: screenHeight,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  movieInfoTitle: {
    paddingLeft: 15,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#131313',
    marginBottom: 5,
  },
  movieInfoText: {
    paddingLeft: 15,
    color: '#131313',
    fontSize: 15,
    fontWeight: 'bold'
  }
})


export default App;