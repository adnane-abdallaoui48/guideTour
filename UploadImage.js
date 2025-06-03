import React, { useState } from 'react';
import { View, Button, Image, Text } from 'react-native';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';

export default function UploadImageFirebase() {
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  // 1. Choisir une image depuis la galerie
  const selectImage = () => {
    launchImageLibrary({mediaType: 'photo'}, (response) => {
      if (response.didCancel) {
        console.log('Utilisateur a annulé');
      } else if (response.errorCode) {
        console.log('Erreur:', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setImageUri(uri);
      }
    });
  };

  // 2. Uploader l’image sur Firebase Storage et récupérer l’URL
  const uploadImage = async () => {
    if (!imageUri) return;

    setUploading(true);

    // Prendre le nom du fichier depuis le chemin (ex: photo.jpg)
    const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);

    // Créer une référence dans Firebase Storage (dossier places/)
    const reference = storage().ref(`places/${filename}`);

    try {
      // Uploader le fichier
      await reference.putFile(imageUri);

      // Récupérer l’URL de téléchargement
      const url = await reference.getDownloadURL();

      setDownloadUrl(url);
      console.log('Image uploadée à cette URL:', url);

    } catch (e) {
      console.error('Erreur upload:', e);
    }

    setUploading(false);
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Choisir une image" onPress={selectImage} />
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 200, height: 200, marginVertical: 10 }}
        />
      )}
      <Button
        title={uploading ? 'Upload en cours...' : 'Uploader l’image'}
        onPress={uploadImage}
        disabled={uploading || !imageUri}
      />
      {downloadUrl && (
        <>
          <Text>Image disponible ici :</Text>
          <Text style={{ color: 'blue' }}>{downloadUrl}</Text>
        </>
      )}
    </View>
  );
}
