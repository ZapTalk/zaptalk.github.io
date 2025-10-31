import React, { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ZapPayButton } from '@/components/ZapPayButton';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { LoginArea } from '@/components/auth/LoginArea';
import { MobileNav } from '@/components/MobileNav';
import { DirectionalArrow } from '@/components/DirectionalArrow';
import { useCatalogStore } from '@/stores/catalog';
import { useEntitlementsStore } from '@/stores/entitlements';
import { useAuthStore } from '@/stores/auth';
import { useRTL } from '@/hooks/useRTL';
import type { QuizItem } from '@/types/catalog';

export function LessonPage() {
  useRTL();
  const { t } = useTranslation();
  const { lessonId } = useParams<{ lessonId: string }>();
  const { getLessonById } = useCatalogStore();
  const { hasAccess, updateProgress, getProgress } = useEntitlementsStore();
  const { pubkey, isGuest } = useAuthStore();

  const [quizAnswers, setQuizAnswers] = useState<Record<string, string | number>>({});
  const [showResults, setShowResults] = useState(false);

  const lesson = lessonId ? getLessonById(lessonId) : undefined;
  const isUnlocked = lesson ? hasAccess(lesson.id) : false;
  const progress = lesson ? getProgress(lesson.id) : undefined;

  if (!lesson) {
    return <Navigate to="/catalog" replace />;
  }

  const handleCompleteLesson = () => {
    if (!lesson) return;

    let score: number | undefined;
    if (lesson.content.quiz && showResults) {
      const correct = lesson.content.quiz.filter((q) => {
        const answer = quizAnswers[q.id];
        return answer === q.correctAnswer || answer?.toString() === q.correctAnswer.toString();
      }).length;
      score = Math.round((correct / lesson.content.quiz.length) * 100);
    }

    updateProgress(lesson.id, true, score);
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
    handleCompleteLesson();
  };

  const renderQuizItem = (item: QuizItem) => {
    const userAnswer = quizAnswers[item.id];
    const isCorrect = showResults && (
      userAnswer === item.correctAnswer ||
      userAnswer?.toString() === item.correctAnswer.toString()
    );

    return (
      <Card key={item.id} className={showResults ? (isCorrect ? 'border-green-500' : 'border-red-500') : ''}>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium">{item.question}</p>
            {showResults && (
              isCorrect ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              ) : (
                <div className="h-5 w-5 text-red-600 flex-shrink-0">✗</div>
              )
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {item.type === 'multiple-choice' && item.options && (
            <div className="space-y-2">
              {item.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    showResults
                      ? index === item.correctAnswer
                        ? 'bg-green-50 border-green-500'
                        : userAnswer === index
                        ? 'bg-red-50 border-red-500'
                        : ''
                      : 'hover:bg-muted'
                  }`}
                >
                  <input
                    type="radio"
                    name={item.id}
                    value={index}
                    checked={userAnswer === index}
                    onChange={(e) => setQuizAnswers({ ...quizAnswers, [item.id]: parseInt(e.target.value) })}
                    disabled={showResults}
                    className="h-4 w-4"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {item.type === 'gap-fill' && (
            <input
              type="text"
              placeholder="Your answer..."
              value={userAnswer as string || ''}
              onChange={(e) => setQuizAnswers({ ...quizAnswers, [item.id]: e.target.value })}
              disabled={showResults}
              className="w-full p-3 border rounded-lg"
            />
          )}

          {item.type === 'true-false' && (
            <div className="flex gap-3">
              {['true', 'false'].map((value) => (
                <label
                  key={value}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                    showResults
                      ? value === item.correctAnswer
                        ? 'bg-green-50 border-green-500'
                        : userAnswer === value
                        ? 'bg-red-50 border-red-500'
                        : ''
                      : 'hover:bg-muted'
                  }`}
                >
                  <input
                    type="radio"
                    name={item.id}
                    value={value}
                    checked={userAnswer === value}
                    onChange={(e) => setQuizAnswers({ ...quizAnswers, [item.id]: e.target.value })}
                    disabled={showResults}
                    className="h-4 w-4"
                  />
                  <span className="capitalize">{value}</span>
                </label>
              ))}
            </div>
          )}

          {showResults && item.explanation && (
            <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded text-sm">
              <p className="font-semibold">Explanation:</p>
              <p>{item.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20 md:pb-0">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/logo-h.png" 
                alt="Zaptalk Logo" 
                className="h-12 w-12 object-contain"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                {t('app.name')}
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <LoginArea className="max-w-60" />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link to={`/catalog/${lesson.level}`}>
            <Button variant="ghost" className="gap-2 mb-4">
              <DirectionalArrow direction="back" className="h-4 w-4" />
              Back to {lesson.level}
            </Button>
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{lesson.title}</h1>
              {lesson.description && (
                <p className="text-muted-foreground">{lesson.description}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3 w-3" />
                {lesson.durationMin} min
              </Badge>
              <Badge variant="outline" className="capitalize">
                {lesson.kind}
              </Badge>
            </div>
          </div>

          {lesson.objectives && (
            <div className="mb-6 p-4 bg-muted/50 rounded-lg">
              <p className="font-semibold mb-2">Learning Objectives:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {lesson.objectives.map((obj, index) => (
                  <li key={index}>{obj}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Locked Content Overlay */}
        {!isUnlocked && (
          <Card className="border-2 border-dashed">
            <CardContent className="py-12 text-center space-y-6">
              <div className="h-20 w-20 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Lock className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">This lesson is locked</h2>
                <p className="text-muted-foreground mb-6">
                  {!pubkey && !isGuest
                    ? 'Sign in with Nostr to unlock lessons'
                    : `Unlock with ${lesson.priceSats.toLocaleString()} sats to access the full content`}
                </p>

                {pubkey && (
                  <ZapPayButton
                    skuId={`sku-lesson-${lesson.id}`}
                    amountSats={lesson.priceSats}
                    displayName={lesson.title}
                    className="mx-auto"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lesson Content */}
        {isUnlocked && (
          <>
            {progress && progress.completed && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Lesson Completed!</p>
                  {progress.score !== undefined && (
                    <p className="text-sm text-green-700">Your score: {progress.score}%</p>
                  )}
                </div>
              </div>
            )}

            <Tabs defaultValue="learn" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="learn">{t('lesson.learn')}</TabsTrigger>
                <TabsTrigger value="practice">{t('lesson.practice')}</TabsTrigger>
              </TabsList>

              <TabsContent value="learn" className="space-y-6">
                {lesson.content.html && (
                  <Card>
                    <CardContent className="pt-6 prose prose-sm md:prose-base max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: lesson.content.html }} />
                    </CardContent>
                  </Card>
                )}

                {!progress?.completed && (
                  <Button onClick={handleCompleteLesson} className="w-full">
                    {t('lesson.mark_complete')}
                  </Button>
                )}
              </TabsContent>

              <TabsContent value="practice" className="space-y-6">
                {lesson.content.quiz && lesson.content.quiz.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {lesson.content.quiz.map(renderQuizItem)}
                    </div>

                    {!showResults && (
                      <Button onClick={handleSubmitQuiz} className="w-full" size="lg">
                        {t('lesson.submit_quiz')}
                      </Button>
                    )}

                    {showResults && (
                      <div className="text-center">
                        <Button onClick={() => { setShowResults(false); setQuizAnswers({}); }} variant="outline">
                          {t('lesson.try_again')}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      {t('lesson.no_practice')}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
