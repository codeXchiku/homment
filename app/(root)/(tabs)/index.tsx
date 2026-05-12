import FeaturedCard from '@/components/FeaturedCard'
import PropertyCard from '@/components/PropertyCard'
import { supabase } from '@/lib/supabase'
import { Property } from '@/types/types'
import { useUser } from '@clerk/expo'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Index = () => {
  const { user } = useUser()
  const router = useRouter()

  const [featured, setFeatured] = useState<Property[]>([])
  const [recommended, setRecommended] = useState<Property[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchProperties = async () => {
    try {
      setLoading(true)

      const { data: featuredData, error: featuredError } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })

      if (featuredError) {
        throw featuredError
      }

      const { data: recommendedData, error: recommendedError } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", false)
        .order("created_at", { ascending: false })

      if (recommendedError) {
        throw recommendedError
      }

      setFeatured(featuredData ?? [])
      setRecommended(recommendedData ?? [])

    } catch (error: any) {
      console.log("Error fetching properties:", error.message)

      Alert.alert(
        "Error",
        error.message || "Something went wrong while fetching properties"
      )
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchProperties()
    }, [])
  )

  return (
    <SafeAreaView>
      <FlatList
        data={recommended}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View className='flex-row items-center justify-between ps-5 pt-4 pb-5'>
              <Image
                source={require("../../../assets/images/kribb.png")}
                style={{ width: 90, height: 36 }}
                resizeMode='contain'
              />
              <View className='items-end mr-4'>
                <Text>Good Morning 👋</Text>
                <Text className='text-gray-900 text-base font-bold px-6'>
                  {user?.firstName}
                </Text>
              </View>
            </View>
            {/* Search Bar */}
            <TouchableOpacity
              onPress={() => router.push("/search")}
              className='mx-5 mb-6 flex-row items-center bg-white rounded-2xl px-4 py-3 gap-3'>
              <Ionicons name='search-outline' size={20} color="#9CA3AF" />
              <Text className='text-gray-400 text-sm flex-1'>Search Properties, cities...</Text>
              <TouchableOpacity
                onPress={() =>
                  router.push("/search?openFilters=true")
                }
                className="w-8 h-8 bg-blue-600 rounded-xl items-center justify-center"
              >
                <Ionicons name="options-outline" size={15} color="white" />
              </TouchableOpacity>
            </TouchableOpacity>
            {/* Featured Section */}
            <View className='mb-6'>
              <Text className='text-gray-900 text-lg font-bold px-5 mb-4'>Featured</Text>

              {loading ? (
                <ActivityIndicator
                size="small"
                color="#2563EB"
                className='py-10'
                />
              ):(<FlatList
              data={featured}
              keyExtractor={(item)=>item.id}
              renderItem={({item})=>(<FeaturedCard property={item}/>)}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingHorizontal:20}}
              />)}
            </View>

            {/* Recommended Header*/}
            <Text className='text-gray-900 text-lg font-bold px-5 mb-4'>Recommended</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className='px-5'>
           <PropertyCard property={item} />
          </View>
        )}
        ListEmptyComponent={
          !loading ? (
            <View className='items-center py-10'>
              <Text className='text-gray-400'>No Properties Found</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  )
}

export default Index