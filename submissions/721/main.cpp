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

bool isLeap(int y){
  return y % 4 == 0 && y % 100 || y % 400 == 0;
}

int main(){
  int y, m, d;
  scanf("%d/%d/%d", &y, &m, &d);
  int days[] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
  if(isLeap(y)) days[2]++;
  d += 2;
  if(d > days[m]){
    d -= days[m];
    m++;
  }
  if(m == 13){
    m = 1;
    y++;
  }
  printf("%04d/%02d/%02d\n", y, m, d);
  return 0;
}
