import { View, Text, StyleSheet, Pressable } from "react-native"
import { capitalize, hp } from "../helpers/common"
import { theme } from "../constants/theme"

export const SectionView = ({ title, content }) => {
    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
                {title}
            </Text>
            <View>
                {content}
            </View>
        </View>
    )
}

export const CommonView = ({ data, filters, filterName, setFilters }) => {
    const onSelect = (item) => {
        setFilters({ ...filters, [filterName]: item })
    }

    return (
        <View style={styles.flexRowWrap}>
            {
                data && data.map((item, index) => {
                    let isActive = filters && filters[filterName] == item;
                    let backgroundColor = isActive ? theme.colors.black : theme.colors.search; // White active, dark inactive
                    let color = isActive ? theme.colors.white : theme.colors.black; // Black text active, White inactive
                    return (
                        <Pressable
                            onPress={() => onSelect(item)}
                            key={item}
                            style={[styles.outlinedButton, { backgroundColor }]}
                        >
                            <Text style={[styles.outlinedButtonText, { color }]}>
                                {capitalize(item)}
                            </Text>
                        </Pressable>
                    )
                })
            }
        </View>
    )
}

export const ColourFilterView = ({ data, filters, filterName, setFilters }) => {
    const onSelect = (item) => {
        setFilters({ ...filters, [filterName]: item })
    }

    return (
        <View style={styles.flexRowWrap}>
            {
                data && data.map((item, index) => {
                    let isActive = filters && filters[filterName] == item;
                    let borderColor = isActive ? theme.colors.neutral(0.4) : 'white';
                    return (
                        <Pressable onPress={() => onSelect(item)} key={item}>

                            <View style={[styles.colorWrapper, { borderColor }]}>
                                <View style={[styles.color, { backgroundColor: item }]} />
                            </View>
                        </Pressable>
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    sectionContainer: {
        gap: 8
    },
    sectionTitle: {
        fontSize: hp(2.4),
        fontWeight: theme.fontWeights.medium,
        color: theme.colors.black // White text
    },
    outlinedButton: {
        padding: 10,
        paddingHorizontal: 16,
        borderRadius: theme.radius.xs,
        borderCurve: 'continuous',
        backgroundColor: theme.colors.search, // Dark background
        borderWidth: 1,
        borderColor: theme.colors.card,
    },
    outlinedButtonText: {
        fontSize: 14,
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.black, // White text
        textAlign: 'center',
    },
    flexRowWrap: {
        gap: 10,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    colorWrapper: {
        padding: 3,
        borderRadius: theme.radius.sm,
        borderWidth: 2,
        borderCurve: 'continuous',
    },
    color: {
        height: 40,
        width: 40,
        borderRadius: theme.radius.sm - 3,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)' // Subtle border for colors
    }

})