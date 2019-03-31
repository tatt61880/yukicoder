//{{{
#include <bits/stdc++.h>
using namespace std;
#define repX(a,b,c,x,...) x
#define repN(a) repX a
#define rep(...) repN((__VA_ARGS__,rep3,rep2,loop))(__VA_ARGS__)
#define rrep(...) repN((__VA_ARGS__,rrep3,rrep2))(__VA_ARGS__)
#define loop(n) rep2(i_,n)
#define rep2(i,n) rep3(i,0,n)
#define rep3(i,begin,end) for(int i=(int)(begin),i##_end=(int)(end);i<i##_end;++i)
#define rrep2(i,n) rrep3(i,n,0)
#define rrep3(i,begin,end) for(int i=(int)(begin-1),i##_end=(int)(end);i>=i##_end;--i)
#define foreach(x,a) for(auto&x:a)
using ll=long long;
const ll mod=(ll)1e9+7;
//}}}

int main(){
  ll T, A, B;
  cin >> T >> A >> B;
  bool ans = true;
  if(abs(A) > T || abs(B) > T){
    ans = false;
  }
  if(T == 1 && A == 0 && B == 0){
    ans = false;
  }
  if(!ans){
    puts("NO");
    return 0;
  }
  puts("YES");
  int x = 0;
  int y = 0;
  auto moveY = [&] (int dy) {
    y += dy;
    printf(dy == 1 ? "^" : "v");
  };
  auto moveX = [&] (int dx) {
    x += dx;
    printf(dx == 1 ? ">" : "<");
  };
  rep(t, 1, T + 1){
    if(t == 1 && (T - B) % 2 != 0){
      moveY(A - y > 0 ? 1 : -1);
      puts("");
      continue;
    }
    if(t == T && (T - A) % 2 != 0){
      moveX(B - x > 0 ? 1 : -1);
      puts("");
      continue;
    }
    moveX(B - x > 0 ? 1 : -1);
    moveY(A - y > 0 ? 1 : -1);
    puts("");
  }
  return 0;
}
