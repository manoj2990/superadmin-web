

// import React, { useState, useEffect } from 'react';

// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { useToast } from '@/hooks/use-toast';
// import { Users, Plus, Image, Mic, Copy } from 'lucide-react';
// import axios from 'axios';
// import { Badge } from '@/components/ui/badge';

// interface AvatarImage {
//   url: string;
//   public_id: string;
// }

// interface Avatar {
//   _id: string;
//   avatarName: string;
//   avatarImage: AvatarImage;
//   avatarAzureResourcesId: string;
//   avatarVoiceId: string;
//   avatarFrame: number;
//   createdAt: string;
//   updatedAt: string;
// }


// const AvatarList: React.FC<AvatarListProps> = () => {
//   const [avatars, setAvatars] = useState<Avatar[]>([]);
//   const [newAvatar, setNewAvatar] = useState({
//     avatarName: '',
//     avatarAzureResourcesId: '',
//     avatarVoiceId: '',
//     naturalFrame: '',
//     naturalFPS: '',
//     speakingFrame:'',
//     speakingFPS:'',
//     avatarImage: null as File | null,
//   });
//   const [isCreating, setIsCreating] = useState(false);
//   const { toast } = useToast();

//   // Fetch all avatars on component mount
//   useEffect(() => {
//     const fetchAvatars = async () => {
//       try {
//         const token = localStorage.getItem('authToken');
//         if (!token) {
//           throw new Error('No authentication token found');
//         }

//         const response = await axios.get<{ data: Avatar[] }>(
//           'http://localhost:4000/api/v1/superadmin/get-all-avatars',
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${token}`,
//             },
//           }
//         );

//         if (response.data && Array.isArray(response.data.data)) {
//         console.log("all avatars --->",response.data.data)
//           setAvatars(response.data.data);
//           toast({
//             title: 'Avatars Fetched Successfully',
//             description: `Loaded ${response.data.data.length} avatars.`,
//           });
//         } else {
//           throw new Error('Invalid response format');
//         }
//       } catch (error) {
//         console.error('Fetch avatars error:', error);
//         toast({
//           title: 'Fetch Failed',
//           description: 'Failed to fetch avatars. Please try again.',
//           variant: 'destructive',
//         });
//       }
//     };

//     fetchAvatars();
//   }, [toast]);

//   // Handle form submission to create a new avatar
//   const handleCreateAvatar = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsCreating(true);

//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         throw new Error('No authentication token found');
//       }

//       const formData = new FormData();
//       formData.append('avatarName', newAvatar.avatarName);
//       formData.append('avatarAzureResourcesId', newAvatar.avatarAzureResourcesId);
//       formData.append('avatarVoiceId', newAvatar.avatarVoiceId);
//       formData.append('avatarFrame', newAvatar.avatarFrame.toString());
//       if (newAvatar.avatarImage) {
//         formData.append('avatarImage', newAvatar.avatarImage);
//       }

//       console.log("formadata-->",formData)

//       const response = await axios.post(
//         'http://localhost:4000/api/v1/superadmin/add-avatar-details',
//         formData,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
           
//           },
//         }
//       );

//       if (response.data && response.data.data) {
//         console.log("after createion --->", response.data.data)
//         setAvatars((prev) => [...prev, response.data.data]);
//         setNewAvatar({
//           avatarName: '',
//           avatarAzureResourcesId: '',
//           avatarVoiceId: '',
//           avatarFrame: 80,
//           avatarImage: null,
//         });
//         toast({
//           title: 'Avatar Created Successfully',
//           description: `New avatar ${response.data.data.avatarName} has been created.`,
//         });
//       }
//     } catch (error) {
//       console.error('Create avatar error:', error);
//       toast({
//         title: 'Creation Failed',
//         description: 'Failed to create new avatar. Please try again.',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   // Handle image file selection
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setNewAvatar((prev) => ({ ...prev, avatarImage: e.target.files![0] }));
//     }
//   };

//   // Handle copying avatar ID
//   const handleCopyId = async (id: string) => {
//     try {
//       await navigator.clipboard.writeText(id);
//       toast({
//         title: 'ID Copied',
//         description: 'Avatar ID copied to clipboard.',
//         className: 'bg-green-100 text-green-800 border-green-300',
//         duration: 2000,
//       });
//     } catch (error) {
//       console.error('Copy ID error:', error);
//       toast({
//         title: 'Copy Failed',
//         description: 'Failed to copy ID. Please try again.',
//         variant: 'destructive',
//         duration: 2000,
//       });
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center space-x-2">
//           <Users className="w-5 h-5 text-blue-600" />
//           <span>Avatar Management</span>
//         </CardTitle>
//         <CardDescription>View and manage all avatars created by you</CardDescription>
//       </CardHeader>
//       <CardContent>
//         {/* Create Avatar Form */}
//         <div className="mb-8 p-6 bg-gray-50 rounded-lg">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//             <Plus className="w-5 h-5 mr-2 text-blue-600" />
//             Create New Avatar
//           </h3>
//           <form onSubmit={handleCreateAvatar} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <Label htmlFor="avatarName">Avatar Name</Label>
//                 <Input
//                   id="avatarName"
//                   value={newAvatar.avatarName}
//                   onChange={(e) =>
//                     setNewAvatar((prev) => ({ ...prev, avatarName: e.target.value }))
//                   }
//                   placeholder="Alice"
//                   required
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="avatarAzureResourcesId">Avatar ID</Label>
//                 <Input
//                   id="avatarAzureResourcesId"
//                   value={newAvatar.avatarAzureResourcesId}
//                   onChange={(e) =>
//                     setNewAvatar((prev) => ({ ...prev, avatarAzureResourcesId: e.target.value }))
//                   }
//                   placeholder="avatar"
//                   required
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="avatarVoiceId">Voice ID</Label>
//                 <Input
//                   id="avatarVoiceId"
//                   value={newAvatar.avatarVoiceId}
//                   onChange={(e) =>
//                     setNewAvatar((prev) => ({ ...prev, avatarVoiceId: e.target.value }))
//                   }
//                   placeholder="en-IN-AashiNeural"
//                   required
//                 />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="avatarFrame">No of Frames</Label>
//                 <Input
//                   id="avatarFrame"
//                   type="number"
//                   value={newAvatar.avatarFrame}
//                   onChange={(e) =>
//                     setNewAvatar((prev) => ({ ...prev, avatarFrame: parseInt(e.target.value) }))
//                   }
//                   placeholder="80"
//                   required
//                 />
//               </div>
//             </div>
//             <div>
//               <Label htmlFor="avatarImage">Avatar Cover Image</Label>
//               <Input
//                 id="avatarImage"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 required
//               />
//             </div>
//             <Button
//               type="submit"
//               disabled={isCreating}
//               className="bg-blue-600 hover:bg-blue-700"
//             >
//               {isCreating ? 'Creating...' : 'Create Avatar'}
//             </Button>
//           </form>
//         </div>

//         {/* Avatar List */}
//         <div className="space-y-4">
//           {avatars.length > 0 ? (
//             avatars.map((avatar) => (
//               <div key={avatar._id} className="p-4 bg-gray-50 rounded-lg border space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-4">
//                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                       <img
//                         src={avatar.avatarImage.url}
//                         alt={avatar.avatarName}
//                         className="w-full h-full object-cover rounded-full"
//                       />
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-gray-900">{avatar.avatarName}</h4>
//                       <p className="text-sm text-gray-600 flex items-center">
//                         <Mic className="w-4 h-4 mr-1" />
//                         {avatar.avatarVoiceId}
//                         <Button
//                           size="icon"
//                           variant="ghost"
//                           onClick={() => handleCopyId(avatar.avatarVoiceId)}
//                           className="ml-2 text-gray-500 hover:text-gray-700"
//                           aria-label="Copy avatar ID to clipboard"
//                         >
//                           <Copy className="w-4 h-4" />
//                         </Button>
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Badge variant="outline">{avatar.avatarAzureResourcesId}</Badge>
//                     <Badge variant="outline">{avatar.avatarFrame} fps</Badge>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center py-8 text-gray-500">
//               <Image className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//               <p>No avatars created yet. Create your first avatar above!</p>
//             </div>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default AvatarList;



//////////////////////


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, Image, Mic, Copy, Activity, Volume2 } from 'lucide-react';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';

interface AvatarImage {
  url: string;
  public_id: string;
}

interface Avatar {
  _id: string;
  avatarName: string;
  avatarImage: AvatarImage;
  avatarAzureResourcesId: string;
  avatarVoiceId: string;
  avatarFrame: number;
  naturalFrame?: number;
  naturalFPS?: number;
  speakingFrame?: number;
  speakingFPS?: number;
  createdAt: string;
  updatedAt: string;
}

interface AvatarListProps {}

const AvatarList: React.FC<AvatarListProps> = () => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [newAvatar, setNewAvatar] = useState({
    avatarName: '',
    avatarAzureResourcesId: '',
    avatarVoiceId: '',
    naturalFrame: 30,
    naturalFPS: 24,
    speakingFrame: 60,
    speakingFPS: 30,
    avatarImage: null as File | null,
  });
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  // Fetch all avatars on component mount
  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get<{ data: Avatar[] }>(
          'http://localhost:4000/api/v1/superadmin/get-all-avatars',
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.data && Array.isArray(response.data.data)) {
          console.log("all avatars --->", response.data.data);
          setAvatars(response.data.data);
          toast({
            title: 'Avatars Fetched Successfully',
            description: `Loaded ${response.data.data.length} avatars.`,
          });
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Fetch avatars error:', error);
        toast({
          title: 'Fetch Failed',
          description: 'Failed to fetch avatars. Please try again.',
          variant: 'destructive',
        });
      }
    };

    fetchAvatars();
  }, [toast]);

  // Handle form submission to create a new avatar
  const handleCreateAvatar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    console.log("new avatar-->",newAvatar)
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formData = new FormData();
      formData.append('avatarName', newAvatar.avatarName);
      formData.append('avatarAzureResourcesId', newAvatar.avatarAzureResourcesId);
      formData.append('avatarVoiceId', newAvatar.avatarVoiceId);
      // formData.append('avatarFrame', newAvatar.avatarFrame.toString());
      formData.append('naturalFrame', newAvatar.naturalFrame.toString());
      formData.append('naturalFPS', newAvatar.naturalFPS.toString());
      formData.append('speakingFrame', newAvatar.speakingFrame.toString());
      formData.append('speakingFPS', newAvatar.speakingFPS.toString());
      
      if (newAvatar.avatarImage) {
        formData.append('avatarImage', newAvatar.avatarImage);
      }

      console.log("avatar data -->", formData);

      const response = await axios.post(
        'http://localhost:4000/api/v1/superadmin/add-avatar-details',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        console.log("after creation --->", response.data.data);
        setAvatars((prev) => [...prev, response.data.data]);
        setNewAvatar({
          avatarName: '',
          avatarAzureResourcesId: '',
          avatarVoiceId: '',
          // avatarFrame: 80,
          naturalFrame: 30,
          naturalFPS: 24,
          speakingFrame: 60,
          speakingFPS: 30,
          avatarImage: null,
        });
        toast({
          title: 'Avatar Created Successfully',
          description: `New avatar ${response.data.data.avatarName} has been created.`,
        });
      }
    } catch (error) {
      console.error('Create avatar error:', error);
      toast({
        title: 'Creation Failed',
        description: 'Failed to create new avatar. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewAvatar((prev) => ({ ...prev, avatarImage: e.target.files![0] }));
    }
  };

  // Handle copying avatar ID
  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      toast({
        title: 'ID Copied',
        description: 'Avatar ID copied to clipboard.',
        className: 'bg-green-100 text-green-800 border-green-300',
        duration: 2000,
      });
    } catch (error) {
      console.error('Copy ID error:', error);
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy ID. Please try again.',
        variant: 'destructive',
        duration: 2000,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-600" />
          <span>Avatar Management</span>
        </CardTitle>
        <CardDescription>View and manage all avatars with dynamic natural and speaking modes</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Create Avatar Form */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-blue-600" />
            Create New Avatar
          </h3>
          <form onSubmit={handleCreateAvatar} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-800 border-b pb-2">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="avatarName">Avatar Name</Label>
                  <Input
                    id="avatarName"
                    value={newAvatar.avatarName}
                    onChange={(e) =>
                      setNewAvatar((prev) => ({ ...prev, avatarName: e.target.value }))
                    }
                    placeholder="Alice"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="avatarAzureResourcesId">Avatar ID</Label>
                  <Input
                    id="avatarAzureResourcesId"
                    value={newAvatar.avatarAzureResourcesId}
                    onChange={(e) =>
                      setNewAvatar((prev) => ({ ...prev, avatarAzureResourcesId: e.target.value }))
                    }
                    placeholder="avatar"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="avatarVoiceId">Voice ID</Label>
                  <Input
                    id="avatarVoiceId"
                    value={newAvatar.avatarVoiceId}
                    onChange={(e) =>
                      setNewAvatar((prev) => ({ ...prev, avatarVoiceId: e.target.value }))
                    }
                    placeholder="en-IN-AashiNeural"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Animation Settings */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-800 border-b pb-2 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-green-600" />
                Animation Settings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Natural Mode */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h5 className="text-sm font-semibold text-green-800 mb-3 flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Natural Mode (Idle State)
                  </h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="naturalFrame" className="text-xs">Natural Frames</Label>
                      <Input
                        id="naturalFrame"
                        type="number"
                        value={newAvatar.naturalFrame}
                        onChange={(e) =>
                          setNewAvatar((prev) => ({ 
                            ...prev, 
                            naturalFrame: parseInt(e.target.value) 
                          }))
                        }
                        placeholder="30"
                        min="1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="naturalFPS" className="text-xs">Natural FPS</Label>
                      <Input
                        id="naturalFPS"
                        type="number"
                        value={newAvatar.naturalFPS}
                        onChange={(e) =>
                          setNewAvatar((prev) => ({ 
                            ...prev, 
                            naturalFPS: parseInt(e.target.value) 
                          }))
                        }
                        placeholder="24"
                        min="1"
                      
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Speaking Mode */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
                    <Volume2 className="w-4 h-4 mr-2" />
                    Speaking Mode (Active State)
                  </h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="speakingFrame" className="text-xs">Speaking Frames</Label>
                      <Input
                        id="speakingFrame"
                        type="number"
                        value={newAvatar.speakingFrame}
                        onChange={(e) =>
                          setNewAvatar((prev) => ({ 
                            ...prev, 
                            speakingFrame: parseInt(e.target.value) 
                          }))
                        }
                        placeholder="60"
                        min="1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="speakingFPS" className="text-xs">Speaking FPS</Label>
                      <Input
                        id="speakingFPS"
                        type="number"
                        value={newAvatar.speakingFPS}
                        onChange={(e) =>
                          setNewAvatar((prev) => ({ 
                            ...prev, 
                            speakingFPS: parseInt(e.target.value) 
                          }))
                        }
                        placeholder="30"
                        min="1"
                      
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Legacy Frame Setting */}
              {/* <div className="p-4 bg-gray-100 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="avatarFrame" className="text-sm">Total Frames (Legacy)</Label>
                    <Input
                      id="avatarFrame"
                      type="number"
                      value={newAvatar.avatarFrame}
                      onChange={(e) =>
                        setNewAvatar((prev) => ({ 
                          ...prev, 
                          avatarFrame: parseInt(e.target.value) || 0 
                        }))
                      }
                      placeholder="80"
                      min="1"
                      required
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Total number of frames for backward compatibility
                    </p>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Avatar Image */}
            <div className="space-y-4 p-4 bg-gray-100 rounded-lg">
              <h4 className="text-md font-medium text-gray-800 border-b pb-2">Avatar Image</h4>
              <div>
                <Label htmlFor="avatarImage">Avatar Cover Image</Label>
                <Input
                  id="avatarImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                <p className="text-xs text-gray-600 mt-1">
                  Upload a cover image that represents your avatar
                </p>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isCreating}
              className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
            >
              {isCreating ? 'Creating Avatar...' : 'Create Avatar'}
            </Button>
          </form>
        </div>

        {/* Avatar List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Existing Avatars</h3>
          {avatars.length > 0 ? (
            avatars.map((avatar) => (
              <div key={avatar._id} className="p-4 bg-gray-50 rounded-lg border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                      <img
                        src={avatar.avatarImage.url}
                        alt={avatar.avatarName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{avatar.avatarName}</h4>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Mic className="w-4 h-4 mr-1" />
                        {avatar.avatarVoiceId}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleCopyId(avatar.avatarVoiceId)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                          aria-label="Copy avatar voice ID to clipboard"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-wrap">
                    <Badge variant="secondary">{avatar.avatarAzureResourcesId}</Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      <Activity className="w-3 h-3 mr-1" />
                      Natural: {avatar.naturalFrame || 'N/A'}f @ {avatar.naturalFPS || 'N/A'}fps
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      <Volume2 className="w-3 h-3 mr-1" />
                      Speaking: {avatar.speakingFrame || 'N/A'}f @ {avatar.speakingFPS || 'N/A'}fps
                    </Badge>
                    {/* <Badge variant="outline" className="bg-gray-50">
                      Total: {avatar.avatarFrame}f
                    </Badge> */}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Image className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No avatars created yet. Create your first avatar above!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AvatarList;