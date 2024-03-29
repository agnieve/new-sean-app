import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import { Modal, Text, TextInput, View, TouchableOpacity, SafeAreaView, Image } from "react-native";
import { useUserStore } from "../../../zustand_store/auth";


export default function AddProductModal(props){

    const { isVisible, setIsVisible, setAction, setNewData } = props;

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");

    const [categoryIds, setCategoryIds] = useState([]);
    const [categories, setCategories] = useState();
    const [isSuccess, setIsSuccess] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const [quantity, setQuantity] = useState(0);

    const user = useUserStore((state) => state.user);

    useEffect(()=> {
        (async ()=> {
            const response = await fetch(`https://sean-aaccd-default-rtdb.asia-southeast1.firebasedatabase.app/categories.json`);
            const result = await response.json();
            const objKeys = Object.keys(result);

            setCategoryIds(objKeys);
            setCategories(result);
        })();
    }, [refresh]);

    const addProductHandler = async () => {
        const base_url = `https://sean-aaccd-default-rtdb.asia-southeast1.firebasedatabase.app/products.json`;

        const options = {
            method: "POST",
            body: JSON.stringify({
                'image': image,
                'name': name,
                'description' : description,
                'price': price,
                'category': category,
                'quantity': quantity,
                'farmerId' : user.id,
                'dateTime': new Date()
            })
        }

        const response = await fetch(base_url, options);
        console.log(await response.json());
        setIsSuccess(true);
        setAction(prev => prev + 1);
        setIsVisible(false);

        setNewData({
            image: image,
            name: name,
            image: image,
            description: description,
            price: price,
            category: category,
            farmerId: user.id,
            dateTime: new Date()
        });

        setImage("");
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
    };

    return <Modal
    className={'flex'}
    animationType="slide"
    transparent={false}
    visible={isVisible}
    onRequestClose={() => {
      setIsVisible(!isVisible);
    }}
  >
  <SafeAreaView className="flex-1">
    <View className={'flex flex-1 p-5'}>
        <View className={'flex flex-row justify-between'}>
            <Text className={'text-center text-2xl'}>Add Product</Text>
            <TouchableOpacity onPress={()=> setIsVisible(false)}>
                <Ionicons name="close" size={30} color="#606060" />
            </TouchableOpacity>
        </View>
        <View>
            <View className={'flex w-full items-center'}>
                <Image className={'w-full rounded-lg h-44 mb-3'} src={image ? image : 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081'} />
            </View>
            <TextInput 
                className={'px-4 py-2 rounded-xl w-full border border-gray-100 mb-3'}
                placeholder="Product Image" 
                value={image}
                onChangeText={setImage}            
            />
            <TextInput 
                className={'px-4 py-2 rounded-xl w-full border border-gray-100 mb-3'}
                placeholder="Product Name" 
                value={name}
                onChangeText={setName}            
            />
            <TextInput 
                className={'px-4 py-2 rounded-xl w-full border border-gray-100 mb-3'}
                placeholder="Product Description"
                multiline={true}   
                value={description}
                onChangeText={setDescription}          
            />
             <TextInput 
                className={'px-4 py-2 rounded-xl w-full border border-gray-100 mb-3'}
                placeholder="Product Price"      
                keyboardType="numeric" 
                value={price}
                onChangeText={setPrice}      
            />
            <TextInput 
                className={'px-4 py-2 rounded-xl w-full border border-gray-100 mb-3'}
                placeholder="Product Quantity"      
                keyboardType="numeric" 
                value={quantity}
                onChangeText={setQuantity}      
            />
            <View className={'flex flex-row items-center gap-x-3'}>
                <Text>Select Category: {category}</Text>
                <TouchableOpacity onPress={()=> setRefresh(prev => prev + 1)}>
                    <Ionicons name={'refresh'} size={15} />
                </TouchableOpacity>
            </View>
            <View className={"h-44 bg-gray-50 px-4 py-4"}>
            {
                categoryIds.length > 0 ?
                <FlashList
                data={categoryIds}
                renderItem={({ item }) => <TouchableOpacity onPress={()=> setCategory(categories[item].name)} className={`mb-3 rounded-lg shadow-sm  py-3 px-4 bg-white`}>
                    <Text className={'text-center'}>{categories[item].name}</Text>
                </TouchableOpacity>}
                estimatedItemSize={200}
                />
                : <Text className={'text-center'}>No Data.</Text>
            }
            </View>
            
            <TouchableOpacity className={'bg-blue-500 px-4 py-3 rounded-xl mb-3'} onPress={addProductHandler}>
                <Text className={'text-center text-white'}>Add Product</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity className={'bg-gray-500 px-4 py-3 rounded-xl'} onPress={()=> {
                setIsVisible(false)
            }}>
                <Text className={'text-center text-white'}>Cancel</Text>
            </TouchableOpacity> */}
        </View>
    </View>
    </SafeAreaView>
  </Modal>
}