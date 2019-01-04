import React from 'react';
import { View, Text, Image} from 'react-native';
import { styles } from '../../styles';

const Service = ({service}) => {
    return (
        <View style={styles.imageContainer}>
            <Image style={styles.image} resizeMode="cover" source={{uri: service.uri}} />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{service.title}</Text>
                <View style={styles.likesContainer}>
                    <Text style={styles.likes}>&hearts; {service.likes} </Text>
                </View>
            </View>
        </View>
    )
}
export { Service };
export default {};