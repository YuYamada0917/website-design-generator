import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
      const { purpose, audience, style } = await req.json();
  
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY is not set');
      }
  
      const message = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 3000,
        messages: [
          {
            role: "user",
            content: `以下の要件に基づいて、より洗練された現代的なウェブサイトデザインを作成してください：
      
      Webサイトの目的: ${purpose}
      ターゲットオーディエンス: ${audience}
      好みのスタイル: ${style}
      
      以下の要素とコンポーネントを必ず含めてください：
      
      1. ヘッダー：
         - ロゴ
         - ナビゲーションメニュー（ホバーエフェクト付き）
         - コールトゥアクションボタン
      
      2. ヒーローセクション：
         - 大きな背景画像または画像スライダー（プレースホルダーとして）
         - キャッチフレーズ
         - サブタイトル
         - メインのコールトゥアクションボタン
      
      3. 特徴セクション：
         - アイコンつきの特徴リスト（少なくとも3つ）
         - 各特徴の簡単な説明
      
      4. サービスまたは製品セクション：
         - カードデザインを使用（画像、タイトル、簡単な説明、ボタン）
         - ホバーエフェクト
      
      5. お問い合わせフォーム：
         - 入力フィールド（名前、メール、メッセージ）
         - 送信ボタン
      
      6. フッター：
         - ソーシャルメディアアイコン
         - クイックリンク
         - コピーライト情報
      
      デザイン要件：
      - モダンで洗練されたデザイン
      - レスポンシブデザイン（モバイルファーストアプローチ）
      - アニメーションやトランジション効果の適切な使用
      - アクセシビリティに配慮（適切なコントラスト、フォーカス状態など）
      - ${style}に基づいたカラースキームとタイポグラフィ
      
      HTMLとCSSをインラインスタイルで提供し、必要に応じてカスタムJavaScriptも含めてください。また、デザインの特徴や、どのようにして指定された要件を満たしているかについても簡単に説明を加えてください。`
          }
        ],
      });
  
      const textContent = message.content.find(content => content.type === 'text');
      if (!textContent || typeof textContent.text !== 'string') {
        throw new Error('Unexpected response format from Claude');
      }
  
      return NextResponse.json({ design: textContent.text });
    } catch (error) {
      console.error('Error generating design:', error);
      return NextResponse.json({ error: 'Error generating design: ' + (error instanceof Error ? error.message : String(error)) }, { status: 500 });
    }
  }