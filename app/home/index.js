import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator } from 'react-native'
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated'
import React, { useCallback } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FontAwesome6, Feather, Ionicons } from '@expo/vector-icons'
import { theme } from '../../constants/theme'
import { hp, wp } from '../../helpers/common'
import { useState, useRef, useEffect } from 'react'
import Categories from '../../components/categories'
import ImageGrid from '../../components/imageGrid'
import { apiCall } from '../../api'
import { debounce } from 'lodash'
import FiltersModel from '../../components/filtersModel'
import { useRouter } from 'expo-router'

var page = 1;

const HomeScreen = () => {
    const { top } = useSafeAreaInsets();
    const paddingTop = top > 0 ? top + 10 : 30;

    const [search, setSearch] = useState('');
    const [images, setImages] = useState([]);
    const [filters, setFilters] = useState(null);
    const [activeCategory, setActiveCategory] = useState('nature');
    const [isEndReached, setIsEndReached] = useState(false);

    const searchInputRef = useRef(null);
    const modelRef = useRef(null);
    const scrollRef = useRef(null)

    const router = useRouter();


    useEffect(() => {
        fetchImages({ page: 1, category: 'nature' });
    }, []);

    const fetchImages = async (param = { page: 1 }, append = false) => {
        let res = await apiCall(param)
        if (res.success && res?.data?.hits) {
            if (append)
                setImages([...images, ...res.data.hits])
            else
                setImages([...res.data.hits])
        }
    };

    const handleChangeCategory = (cat) => {
        setActiveCategory(cat);
        clearSearch();
        setImages([]);
        page = 1;
        let param = {
            page,
            ...filters
        }

        if (cat) param.category = cat;
        console.log('param:', param.category);
        fetchImages(param, false);
    }

    const handleSearch = (text) => {
        setSearch(text);
        if (text.length > 2) { //search for this text
            page = 1;
            setImages([]);
            setActiveCategory(null); //clear category when user is searching
            fetchImages({ page, q: text, ...filters }, false)
        }

        if (text == "") { //reset results
            page = 1;
            searchInputRef?.current?.clear();
            setImages([]);
            setActiveCategory(null); //clear category when user is searching
            fetchImages({ page, ...filters }, false)
        }
    }

    const clearSearch = () => { //clear searchbox
        setSearch("")
        searchInputRef?.current?.clear();
    }

    const openFilterModel = () => {
        modelRef?.current?.present();
    }

    const closeFilterModel = () => {
        modelRef?.current?.close();
    }

    const applyFilters = () => {
        if (filters) {
            page = 1;
            setImages([]);
            let param = {
                page,
                ...filters
            }
            if (activeCategory) param.category = activeCategory;
            if (search) param.q = search;
            fetchImages(param, false);
        }
        closeFilterModel();
    }

    const resetFilters = () => {
        if (filters) {
            page = 1;
            setFilters(null);
            setImages([]);
            let param = {
                page,
            }
            if (activeCategory) param.category = activeCategory;
            if (search) param.q = search;
            fetchImages(param, false);
        }
        closeFilterModel();
    }

    const clearThisFilter = (filterName) => {
        let filterz = { ...filters };
        delete filterz[filterName];
        setFilters({ ...filterz });
        page = 1;
        setImages([]);
        let param = {
            page,
            ...filterz
        }
        if (activeCategory) param.category = activeCategory;
        if (search) param.q = search;
        fetchImages(param, false);
    }

    const handleScroll = (event) => {
        const contentHeight = event.nativeEvent.contentSize.height;
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
        const scrollOffset = event.nativeEvent.contentOffset.y;
        const bottomPosition = contentHeight - scrollViewHeight;

        if (scrollOffset >= bottomPosition - 1) {
            if (!isEndReached) {
                setIsEndReached(true);
                ++page;
                let param = {
                    page,
                }
                if (activeCategory) param.category = activeCategory;
                if (search) param.q = search;
                fetchImages(param, true);
            }
        } else if (isEndReached) {
            setIsEndReached(false);
        }
    }

    const handleScrollUp = () => {
        scrollRef?.current?.scrollTo({
            y: 0,
            Animated: true
        })
    }


    const handleTextDebounce = useCallback(debounce(handleSearch, 400, []))

    const [showCategories, setShowCategories] = useState(false);
    const categoryTimer = useRef(null);

    // ... existing functions ...

    const toggleCategories = () => {
        if (showCategories) {
            setShowCategories(false);
            if (categoryTimer.current) clearTimeout(categoryTimer.current);
        } else {
            setShowCategories(true);
            // Auto hide after 5 seconds
            if (categoryTimer.current) clearTimeout(categoryTimer.current);
            categoryTimer.current = setTimeout(() => {
                setShowCategories(false);
            }, 5000);
        }
    }

    // Reset timer on interaction if needed, or stick to simple toggle

    return (
        <View style={[styles.container, { paddingTop }]}>

            {/* Header */}
            <View style={styles.header}>
                <View style={{ width: 30 }} />
                <Text style={styles.title}>
                    PixelNest
                </Text>
                <Pressable onPress={() => router.push('home/liked')}>
                    <Feather name="heart" size={24} color={theme.colors.neutral(0.7)} />
                </Pressable>
            </View>
            {/* Main Home */}
            <ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={5}
                ref={scrollRef}
                contentContainerStyle={{ paddingBottom: 200 }}
            >
                {/* filters */}
                {
                    filters && (
                        <View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
                                {
                                    Object.keys(filters).map((key, index) => {
                                        return (
                                            <View key={key} style={styles.filterItem}>
                                                {
                                                    key == 'colors' ? (
                                                        <View style={{
                                                            height: 30,
                                                            width: 30,
                                                            borderRadius: 7,
                                                            backgroundColor: filters[key]
                                                        }} />
                                                    ) : (
                                                        <Text style={styles.filterItemText}>
                                                            {filters[key]}
                                                        </Text>
                                                    )
                                                }
                                                <Pressable style={styles.filterCloseIcon} onPress={() => clearThisFilter(key)}>
                                                    <Ionicons name="close" size={14} color={'white'} />
                                                </Pressable>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    )
                }
                {/* images grid */}
                <View>
                    {
                        images.length > 0 && <ImageGrid images={images} router={router} />
                    }
                </View>

                {/* loading */}
                <View
                    style={
                        { marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }
                    }>
                    <ActivityIndicator size="large" />
                </View>
            </ScrollView>

            {/* Bottom Navigation Area */}
            <View style={styles.bottomContainer}>

                {/* Floating Categories */}
                {
                    showCategories && (
                        <Animated.View entering={FadeInDown.springify()} exiting={FadeOutDown.springify()} style={styles.categoriesFloating}>
                            <Categories
                                activeCategory={activeCategory}
                                handleChangeCategory={handleChangeCategory}
                            />
                        </Animated.View>
                    )
                }

                {/* Search bar */}
                <View style={styles.searchBar}>
                    {/* Category Toggle Button */}
                    <Pressable onPress={toggleCategories} style={styles.iconButton}>
                        <FontAwesome6 name={showCategories ? "xmark" : "layer-group"} size={20} color={theme.colors.neutral(0.5)} />
                    </Pressable>


                    <TextInput
                        placeholder='Search for picture'
                        placeholderTextColor={theme.colors.placeholder}
                        ref={searchInputRef}
                        onChangeText={handleTextDebounce} //added delay time for search
                        style={styles.searchInput}
                    />
                    {
                        search ? (
                            <Pressable onPress={() => { handleSearch("") }} style={styles.closeIcon}>
                                <Ionicons name="close" size={20} color={theme.colors.neutral(0.4)} />
                            </Pressable>
                        ) : (
                            <View style={styles.searchIcon}>
                                <Feather name="search" size={20} color={theme.colors.neutral(0.4)} />
                            </View>
                        )
                    }
                </View>

            </View>

            {/* Filters model */}
            <FiltersModel
                modelRef={modelRef}
                filters={filters}
                setFilters={setFilters}
                onClose={closeFilterModel}
                onApply={applyFilters}
                onReset={resetFilters}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 15,
        backgroundColor: theme.colors.white, // Ensure full dark background
    },
    header: {
        marginHorizontal: wp(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    title: {
        fontSize: hp(2), // Reduced size to match search
        fontWeight: theme.fontWeights.medium,
        color: theme.colors.placeholder,
        letterSpacing: 1,
    },
    categoriesFloating: {
        marginBottom: 10,
    },
    searchBar: {
        marginHorizontal: wp(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.search,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: theme.radius.xl,
        marginBottom: 10,
        gap: 10
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(18, 18, 18, 0.9)', // Semi-transparent dark bg
        paddingTop: 10,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)'
    },
    iconButton: {
        padding: 5
    },
    searchIcon: {
        padding: 5,
    },
    searchInput: {
        flex: 1,
        borderRadius: theme.radius.sm,
        paddingVertical: 8, // Reduced
        fontSize: hp(1.8),
        color: theme.colors.black,
    },
    closeIcon: {
        padding: 4,
        backgroundColor: theme.colors.neutral(0.1),
        borderRadius: 50
    },
    categories: {
        //marginBottom: -20,
        //marginTop: -15
    },
    headerIcon: {
        width: 24,
        height: 24,
        tintColor: theme.colors.neutral(0.1),
        marginHorizontal: 8,
        resizeMode: 'contain',
    },
    filters: {
        paddingHorizontal: wp(4),
        gap: 10,
        marginBottom: 15
    },
    filterItem: {
        backgroundColor: theme.colors.card, // Dark card background for filters
        padding: 3,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: theme.radius.md,
        padding: 8,
        gap: 10,
        paddingHorizontal: 10,
        // Remove strong shadows for cleaner look
    },
    filterItemText: {
        fontSize: hp(1.9),
        color: theme.colors.black // White text
    },
    filterCloseIcon: {
        backgroundColor: theme.colors.neutral(0.2), // Subtle close icon
        padding: 4,
        borderRadius: theme.radius.xs,
    }

});

export default HomeScreen 