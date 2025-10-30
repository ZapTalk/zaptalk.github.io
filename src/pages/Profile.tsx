import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, User, Edit2, Save, X, Award, BookOpen, Zap as ZapIcon, LogOut, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { LoginArea } from '@/components/auth/LoginArea';
import { MobileNav } from '@/components/MobileNav';
import { OverlayScrollbar } from '@/components/OverlayScrollbar';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAuthor } from '@/hooks/useAuthor';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useUploadFile } from '@/hooks/useUploadFile';
import { useToast } from '@/hooks/useToast';
import { useAuthStore } from '@/stores/auth';
import { useEntitlementsStore } from '@/stores/entitlements';
import { useCatalogStore } from '@/stores/catalog';
import { useRTL } from '@/hooks/useRTL';
import type { NostrMetadata } from '@nostrify/nostrify';

export function Profile() {
  useRTL();
  const { t } = useTranslation();
  const { user } = useCurrentUser();
  const author = useAuthor(user?.pubkey);
  const metadata = author.data?.metadata;
  const { logout } = useAuthStore();
  const { entitlements } = useEntitlementsStore();
  const { lessons } = useCatalogStore();
  const { mutate: publishEvent } = useNostrPublish();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<NostrMetadata>>({
    name: '',
    display_name: '',
    about: '',
    picture: '',
    website: '',
  });

  // Update form data when metadata is loaded
  useEffect(() => {
    if (metadata) {
      setFormData({
        name: metadata.name || '',
        display_name: metadata.display_name || '',
        about: metadata.about || '',
        picture: metadata.picture || '',
        website: metadata.website || '',
      });
    }
  }, [metadata]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please select an image file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // The upload returns an array of tag tuples, the first tuple contains the url
      const [[, url]] = await uploadFile(file);
      if (!url) {
        throw new Error('No URL returned from upload');
      }
      setFormData((prev) => ({ ...prev, picture: url }));
      toast({
        title: 'Image uploaded',
        description: 'Your profile picture has been uploaded.',
      });
    } catch (err) {
      // log for debugging
  console.error('Profile image upload error:', err);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSave = () => {
    if (!user) return;

    publishEvent(
      {
        kind: 0,
        content: JSON.stringify(formData),
      },
      {
        onSuccess: () => {
          toast({
            title: 'Profile updated',
            description: 'Your profile has been updated successfully.',
          });
          setIsEditing(false);
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to update profile. Please try again.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleCancel = () => {
    setFormData({
      name: metadata?.name || '',
      display_name: metadata?.display_name || '',
      about: metadata?.about || '',
      picture: metadata?.picture || '',
      website: metadata?.website || '',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  // Calculate statistics
  const unlockedLessons = entitlements.filter(e => e.skuId.startsWith('lesson-'));
  const completedLessons: typeof entitlements = []; // We don't have progress tracking currently
  const totalSpent = 0; // We don't track amount paid currently
  const averageScore = 0; // We don't have score tracking currently

  if (!user) {
    return (
      <OverlayScrollbar className="h-screen">
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20 md:pb-0">
        <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 md:py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 md:gap-3">
                <img 
                  src="/logo-h.png" 
                  alt="Zaptalk Logo" 
                  className="h-10 w-10 md:h-12 md:w-12 object-contain"
                />
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                  {t('app.name')}
                </span>
              </Link>
              <div className="flex items-center gap-2 md:gap-3">
                <LanguageSwitcher />
                <div className="hidden md:block">
                  <LoginArea className="max-w-60" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-12 pb-8">
              <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Sign in required</h2>
              <p className="text-muted-foreground mb-6">
                Please sign in to view your profile
              </p>
              <LoginArea className="max-w-60 mx-auto" />
            </CardContent>
          </Card>
        </div>

        <MobileNav />
        </div>
      </OverlayScrollbar>
    );
  }

  const displayName = metadata?.display_name || metadata?.name || 'Anonymous';
  const username = metadata?.name || user.pubkey.slice(0, 8);
  const bio = metadata?.about || 'No bio yet';
  const avatarUrl = metadata?.picture;

  return (
    <OverlayScrollbar className="h-screen">
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20 md:pb-0">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 md:gap-3">
              <img 
                src="/logo-h.png" 
                alt="Zaptalk Logo" 
                className="h-10 w-10 md:h-12 md:w-12 object-contain"
              />
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                {t('app.name')}
              </span>
            </Link>

            <div className="flex items-center gap-2 md:gap-3">
              <LanguageSwitcher />
              <div className="hidden md:block">
                <LoginArea className="max-w-60" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/catalog">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Catalog
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={isEditing ? formData.picture : avatarUrl} />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500 to-purple-400 text-white">
                        {displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <label
                        htmlFor="profile-picture-upload"
                        className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
                      >
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        <input
                          id="profile-picture-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                        />
                      </label>
                    )}
                  </div>
                </div>
                
                {!isEditing ? (
                  <>
                    <CardTitle className="text-2xl">{displayName}</CardTitle>
                    <CardDescription>@{username}</CardDescription>
                  </>
                ) : (
                  <div className="space-y-4 text-left">
                    <div>
                      <Label htmlFor="picture">Avatar URL</Label>
                      <Input
                        id="picture"
                        value={formData.picture}
                        onChange={(e) => setFormData({ ...formData, picture: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="display_name">Display Name</Label>
                      <Input
                        id="display_name"
                        value={formData.display_name}
                        onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Username</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="johndoe"
                      />
                    </div>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {!isEditing ? (
                  <>
                    <div>
                      <Label className="text-muted-foreground text-xs">Bio</Label>
                      <p className="text-sm mt-1">{bio}</p>
                    </div>

                    {metadata?.website && (
                      <div>
                        <Label className="text-muted-foreground text-xs">Website</Label>
                        <a
                          href={metadata.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline block mt-1"
                        >
                          {metadata.website}
                        </a>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-2">
                      <Button
                        className="w-full gap-2"
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit Profile
                      </Button>
                      <Button
                        className="w-full gap-2"
                        variant="destructive"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        Log Out
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="about">Bio</Label>
                      <Textarea
                        id="about"
                        value={formData.about}
                        onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                      <Button className="flex-1 gap-2" onClick={handleSave}>
                        <Save className="h-4 w-4" />
                        Save
                      </Button>
                      <Button className="flex-1 gap-2" variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats and Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{unlockedLessons.length}</p>
                      <p className="text-xs text-muted-foreground">Unlocked</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <Award className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{completedLessons.length}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center">
                      <ZapIcon className="h-6 w-6 text-orange-600 fill-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{totalSpent}</p>
                      <p className="text-xs text-muted-foreground">Sats Spent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Award className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{averageScore}%</p>
                      <p className="text-xs text-muted-foreground">Avg Score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>Your journey through the CEFR levels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => {
                  const levelLessons = lessons.filter(l => l.level === level);
                  const levelCompletedCount = 0; // We don't have progress tracking
                  const progress = levelLessons.length > 0 
                    ? (levelCompletedCount / levelLessons.length) * 100 
                    : 0;

                  return (
                    <div key={level} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{level}</Badge>
                          <span className="font-medium">{t(`levels.${level}`)}</span>
                        </div>
                        <span className="text-muted-foreground">
                          {levelCompletedCount}/{levelLessons.length} completed
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest lessons</CardDescription>
              </CardHeader>
              <CardContent>
                {entitlements.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No lessons unlocked yet</p>
                    <Link to="/catalog">
                      <Button className="mt-4">Browse Catalog</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {entitlements
                      .slice(0, 5)
                      .map((entitlement) => {
                        const lessonId = entitlement.skuId.replace('lesson-', '');
                        const lesson = lessons.find(l => l.id === lessonId);
                        if (!lesson) return null;

                        return (
                          <Link
                            key={entitlement.skuId}
                            to={`/lesson/${lesson.id}`}
                            className="block"
                          >
                            <div className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted transition-colors">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="text-xs">
                                    {lesson.level}
                                  </Badge>
                                  <h4 className="font-medium">{lesson.title}</h4>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {lesson.description}
                                </p>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
      </div>
    </OverlayScrollbar>
  );
}
