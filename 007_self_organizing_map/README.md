# Self-Organizing Map 2020
- 自己組織化写像を実装した。ランダムな色を入力データとして、学習している。
- 近い場所に近い色が配置される。

![例](screenshot.png)

## 実装
- 高速に学習を行うため、100フレームに1回しか描画しないようにした。

## to do
- 学習率を適当に決めるのではなく、参考文献で使われている関数と同じものを使う。

### オブジェクトの構造
![](structure.png)